import React from 'react';
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';
import { useLocalized } from '../../shared/docsGlobals';
import {
  DOCS_PAGE_COPY,
  appsUsing,
  isStatusTag,
  readGuidelines,
  sourceHref,
  splitTitle,
  type Guidelines,
} from './docsMeta';
import { useCopyFeedback } from '../../shared/useCopyFeedback';
import './docsPage.css';

const COPY_RESET_MS = 1600;

/** Renders `code` spans written with backticks in guideline strings. */
function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text
        .split('`')
        .map((part, index) =>
          index % 2 === 1 ? <code key={part}>{part}</code> : <span key={part}>{part}</span>,
        )}
    </>
  );
}

function ImportSnippet({ name }: { name: string }) {
  const { status, copy } = useCopyFeedback(COPY_RESET_MS);
  const text = useLocalized(DOCS_PAGE_COPY);
  const snippet = `import { ${name} } from '@polprog/native-ui';`;
  const label = { idle: text.copy, copied: text.copied, failed: text.copyFailed }[status];

  return (
    <div className="nui-docs-import">
      <code>{snippet}</code>
      <button type="button" onClick={() => void copy(snippet)} aria-live="polite">
        {label}
      </button>
    </div>
  );
}

function Badges({ tags, name }: { tags: readonly string[]; name: string }) {
  const apps = appsUsing(name);
  const text = useLocalized(DOCS_PAGE_COPY);

  return (
    <div className="nui-docs-badges">
      {tags.filter(isStatusTag).map((tag) => (
        <span key={tag} className={`nui-docs-badge is-${tag}`}>
          {text.statusTags[tag]}
        </span>
      ))}
      <span className="nui-docs-badge is-a11y">{text.axeChecked}</span>
      {apps.length > 0 ? (
        <span className="nui-docs-usage">
          {text.usedBy}{' '}
          {apps.map((app, index) => (
            <React.Fragment key={app.name}>
              {index > 0 ? ' · ' : null}
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                {app.name}
              </a>
            </React.Fragment>
          ))}
        </span>
      ) : null}
    </div>
  );
}

function GuidelineList({ guidelines }: { guidelines: Guidelines }) {
  const text = useLocalized(DOCS_PAGE_COPY);

  return (
    <section className="nui-docs-guidelines" aria-label={text.guidelinesLabel}>
      <div className="nui-docs-guide is-do">
        <h3>{text.doTitle}</h3>
        <ul>
          {guidelines.do.map((item) => (
            <li key={item}>
              <InlineCode text={item} />
            </li>
          ))}
        </ul>
      </div>
      <div className="nui-docs-guide is-dont">
        <h3>{text.dontTitle}</h3>
        <ul>
          {guidelines.dont.map((item) => (
            <li key={item}>
              <InlineCode text={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Docs page for every component and primitive: a header with status badges,
 * the apps that ship it, a copyable import and a source link; then the
 * primary story, props, structured guidelines and the remaining stories.
 */
export function ComponentDocsPage() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const { group, name } = splitTitle(preparedMeta.title);
  const guidelines = readGuidelines(preparedMeta.parameters.guidelines);
  const source = sourceHref(group, name);
  const text = useLocalized(DOCS_PAGE_COPY);

  return (
    <div className="nui-docs">
      <header className="nui-docs-header">
        <span className="nui-docs-eyebrow">{group}</span>
        <Title />
        <Badges tags={preparedMeta.tags} name={name} />
        <Subtitle />
        {/* Tokens and patterns are not importable components, so they get no snippet. */}
        {source ? (
          <div className="nui-docs-actions">
            <ImportSnippet name={name} />
            <a className="nui-docs-source" href={source} target="_blank" rel="noopener noreferrer">
              {text.viewSource}
            </a>
          </div>
        ) : null}
      </header>
      <Primary />
      <Controls />
      {guidelines ? <GuidelineList guidelines={guidelines} /> : null}
      <Description />
      <Stories includePrimary={false} />
    </div>
  );
}
