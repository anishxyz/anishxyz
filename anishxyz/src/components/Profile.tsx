const Profile = () => {
    return (
        <div className="font-mono text-sm leading-loose space-y-4">
            <p><strong>Hi!</strong> I&#39;m Anish and I like to build things.</p>
            <p>I&#39;m currently working on <a href="https://scale.com/genai-platform" className="hover:font-bold italic">enterprise
                ai @ Scale AI</a> and a scout for <a href="https://a16z.com" className="hover:font-bold italic">a16z</a>.</p>
            <p>Previously:</p>
            <ul style={{listStyleType: 'disc', marginLeft: '1.5rem'}}>
                <li>Studied computer science and robotics at the <a href="https://www.upenn.edu"
                                                                    className="hover:font-bold italic">University of
                    Pennsylvania</a></li>
                <li>Co-founded <a href="https://www.ycombinator.com/companies/chatter"
                                  className="hover:font-bold italic">Chatter</a> (acq.) and built developer tooling for AI
                </li>
                <li>Founder in the summer &#39;23 batch of <a href="https://www.ycombinator.com"
                                                          className="hover:font-bold italic">Y Combinator</a></li>
            </ul>
            <p>Always excited to talk about startups, robotics, ai/ml, and food!</p>
            <p><strong>Anish Agrawal 😎</strong></p>
            <hr className="border-[#666]"/>
            <div className="space-y-1 text-[#C50]">
                <p>
                    <a
                        href="https://x.com/anishtxt"
                        className="hover:font-bold hover:italic"
                    >
                        x/twitter:anishtxt
                    </a>
                </p>

                <p>
                    <a
                        href="https://www.linkedin.com/in/anishagrawal1"
                        className="hover:font-bold hover:italic"
                    >
                        linkedin:anishagrawal1
                    </a>
                </p>

                <p>
                    <a
                        href="https://anishagrawal.substack.com"
                        className="hover:font-bold hover:italic"
                    >
                        substack:anishagrawal
                    </a>
                </p>

                <p>
                    <a
                        href="https://www.instagram.com/anishagrawal.jpg"
                        className="hover:font-bold hover:italic"
                    >
                        instagram:anishagrawal.jpg
                    </a>
                </p>

                <p>
                    <a
                        href="https://beliapp.co/app/anishagrawal"
                        className="hover:font-bold hover:italic"
                    >
                        beli:anishagrawal
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Profile;
