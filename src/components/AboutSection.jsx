import { SITE } from "../content/siteContent";
import { PhotoGreeting, AboutExtras } from "./AboutDetails";

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-photo">
        <div className="about-photo-frame">
          {SITE.profilePhoto ? <img src={SITE.profilePhoto} alt={SITE.name} /> : <span>{SITE.monogram}</span>}
        </div>
        <p className="about-photo-caption">{SITE.profileCaption}</p>
        <PhotoGreeting />
      </div>
      <div className="about-copy">
        <h2>{SITE.about.heading}</h2>
        <div className="about-meta">
          <span>
            <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" /></svg>
            {SITE.about.location}
          </span>
          <span>
            <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 8.2 12 13.5 23 8.2 12 3Z" /><path d="M5 11.2v5.1c1.8 1.8 4.2 2.7 7 2.7s5.2-.9 7-2.7v-5.1l-7 3.3-7-3.3ZM21 9.5v6.4h2V8.6l-2 .9Z" /></svg>
            {SITE.about.education}
          </span>
        </div>
        {SITE.about.paragraphs.map((paragraph, index) => (
          <p key={index}>{typeof paragraph === "string" ? paragraph : <>
            {paragraph.before}<a href={paragraph.linkUrl} target="_blank" rel="noreferrer">{paragraph.linkText}</a>{paragraph.after}
          </>}</p>
        ))}
        <AboutExtras />
      </div>
    </section>
  );
}
