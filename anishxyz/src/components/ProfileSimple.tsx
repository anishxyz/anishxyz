const ProfileSimple = () => {
    return (
        <div>
            <div className='pb-4'>
                <h2 className="text-lg font-semibold">👋 Hello there, I&apos;m Anish</h2>
            </div>
            <div className='pb-4'>
                <p>👨🏽‍💻 I&apos;m an engineer @ Scale AI (prev. Chatter, Autodesk, Mojo Vision)</p>
                <p>🏫 Computer Science + Robotics @ UPenn (on leave)</p>
                <p>🟧 Y Combinator S23 Alum - Chatter (acq.)</p>
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