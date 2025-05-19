import { FC } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook, FaLinkedinIn, FaTelegram } from 'react-icons/fa';
import { useAppSelector } from '@/state/hooks';

export interface ShareButtonsProps {
    score: number;
    url: string;
    message: string;
    total: number;
    percentage: number;
  }

const ShareButtons: FC<ShareButtonsProps> = ({ score, url, message, total, percentage }) => {
    const { fallacyMasteries } = useAppSelector(state => state.fallacyTrainer);

    const formatMessage = (template: string) => {
    return template
      .replace('{score}', score.toString())
      .replace('{total}', total.toString())
      .replace('{mastered}', Object.keys(fallacyMasteries).length.toString())
      .replace('{percentage}', percentage.toString());
  };
  
  const formattedMessage = formatMessage(message);
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(formattedMessage);
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${formattedMessage} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-slate-600 mb-3">
        <pre>{formatMessage(message)}</pre>
        <a href={url} className='underline'>{url}</a>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => window.open(shareLinks.twitter, '_blank', 'width=550,height=420')}
          className="p-2 rounded-full bg-[#1DA1F2] hover:bg-[#1a94df] text-white transition-colors"
          aria-label="Share on Twitter"
        >
          <FaXTwitter size={20} />
        </button>
        <button 
          onClick={() => window.open(shareLinks.facebook, '_blank', 'width=550,height=420')}
          className="p-2 rounded-full bg-[#4267B2] hover:bg-[#385899] text-white transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook size={20} />
        </button>
        <button 
          onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=550,height=420')}
          className="p-2 rounded-full bg-[#0077B5] hover:bg-[#006699] text-white transition-colors"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn size={20} />
        </button>
        <button 
          onClick={() => window.open(shareLinks.telegram, '_blank', 'width=550,height=420')}
          className="p-2 rounded-full bg-[#0088cc] hover:bg-[#0077b3] text-white transition-colors"
          aria-label="Share on Telegram"
        >
          <FaTelegram size={20} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;