import { useLocalized, type DocsLanguage } from '../../../shared/docsGlobals';
import { testsHealth, type TestsHealth } from './stats';

interface HealthCopy {
  notMeasured: string;
  green: string;
  failing: (count: number) => string;
}

const HEALTH_COPY: Record<DocsLanguage, HealthCopy> = {
  en: {
    notMeasured: 'Run test:report to measure',
    green: 'Whole suite green',
    failing: (count) => `${count} failing`,
  },
  pl: {
    notMeasured: 'Uruchom test:report, aby zmierzyć',
    green: 'Cały zestaw zielony',
    failing: (count) => `Niezaliczone: ${count}`,
  },
};

function describe(health: TestsHealth, copy: HealthCopy): string {
  if (health.kind === 'failing') {
    return copy.failing(health.count);
  }

  return health.kind === 'green' ? copy.green : copy.notMeasured;
}

/** Test-suite health in the docs language, for the Dashboard stat card. */
export function TestsHealthText() {
  const copy = useLocalized(HEALTH_COPY);

  return <>{describe(testsHealth(), copy)}</>;
}
