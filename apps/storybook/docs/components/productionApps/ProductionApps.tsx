import { useId, type CSSProperties } from 'react';
import { useLocalized } from '../../../shared/docsGlobals';
import { PRODUCTION_APPS, PRODUCTION_APPS_COPY, type ProductionApp } from './productionAppsConfig';
import './productionApps.css';

/** Brand colours reach the CSS as custom properties, so one stylesheet serves every app. */
type BrandStyle = CSSProperties & { '--app-from': string; '--app-to': string };

/** Rendered size of the app icon; the WebP files are 2.5x for sharp retina output. */
const ICON_SIZE = 64;

function AppCard({ app }: { app: ProductionApp }) {
  const titleId = useId();
  const brandStyle: BrandStyle = { '--app-from': app.brand.from, '--app-to': app.brand.to };
  const copy = useLocalized(PRODUCTION_APPS_COPY);
  const text = useLocalized(app.text);

  return (
    <article className="nui-app-card" style={brandStyle} aria-labelledby={titleId}>
      <header className="nui-app-banner">
        <img
          className="nui-app-icon"
          src={app.icon}
          alt=""
          width={ICON_SIZE}
          height={ICON_SIZE}
          loading="lazy"
          decoding="async"
        />
        <div className="nui-app-heading">
          <span className="nui-app-live">{copy.liveBadge}</span>
          <h3 id={titleId}>{app.name}</h3>
          <p>{text.tagline}</p>
        </div>
      </header>
      <dl className="nui-app-metrics">
        {text.metrics.map((metric) => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
      <p className="nui-app-desc">{text.description}</p>
      <ul className="nui-app-tags">
        {text.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <a className="nui-app-cta" href={app.url} target="_blank" rel="noopener noreferrer">
        {`${copy.ctaPrefix} ${app.name}`}
        <span className="nui-app-sr">{` ${copy.newTab}`}</span>
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

/** "Shipped with native-ui" section: promo cards for the apps running the library. */
export function ProductionApps() {
  const titleId = useId();
  const copy = useLocalized(PRODUCTION_APPS_COPY);

  return (
    /* `sb-unstyled` keeps Storybook Docs typography from restyling the cards. */
    <section className="nui-apps sb-unstyled" aria-labelledby={titleId}>
      <div className="nui-apps-head">
        <span className="nui-apps-eyebrow">{copy.eyebrow}</span>
        <h2 id={titleId}>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <div className="nui-apps-grid">
        {PRODUCTION_APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
