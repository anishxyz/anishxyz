interface EmojiListItemProps {
  emoji: string;
  text: string;
}

const EmojiListItem = ({ emoji, text }: EmojiListItemProps) => (
  <div className="flex items-start">
    <span className="text-center mr-4">{emoji}</span>
    <span className="flex-grow">{text}</span>
  </div>
);

const ProfileSimple = () => {
    return (
        <div className='space-y-6 font-mono'>
            <div>
                <h2 className="text-md font-semibold">
                    <EmojiListItem emoji="👋" text="Hello there, I'm Anish" />
                </h2>
            </div>
            <div>
                <EmojiListItem emoji="👨🏽‍💻" text="Building enterprise AI @ Scale AI (prev. Chatter, Autodesk, Mojo Vision)" />
                <EmojiListItem emoji="🏫" text="Computer Science + Robotics @ UPenn (on leave)" />
                <EmojiListItem emoji="🟧" text="Y Combinator S23 Alum - Chatter (acq.)" />
            </div>
            <p className='text-orange-600'>
                <a className="underline" href="https://twitter.com/anishtxt">x/twitter</a> {' '}
                <a className="underline" href="https://www.linkedin.com/in/anishagrawal1/">linkedin</a> {' '}
                <a className="underline" href="https://instagram.com/anishagrawal.jpg">instagram</a>
            </p>
        </div>
    );
};

export default ProfileSimple;