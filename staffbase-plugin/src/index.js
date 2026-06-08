import { loadQualtrics } from './QualtricsLoader.js';
import { refreshQualtrics } from './RouteListener.js';

export default function init(context) {
  const user = context?.user || {};
  const userId = user.id || user.externalId || 'anonymous';

  loadQualtrics(userId);

  if (context.router && typeof context.router.listen === 'function') {
    context.router.listen(() => {
      refreshQualtrics();
    });
  }
}
