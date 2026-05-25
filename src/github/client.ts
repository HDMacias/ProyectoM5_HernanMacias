import { Octokit} from '@octokit/rest';
import { AuthenticationError } from '../errors/index.js';
import { logInfo} from '../utils/logging.js';

let octokitInstance: Octokit | null = null;

export function getOctokitInstance(): Octokit {
  if (octokitInstance) {
    return octokitInstance;
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new AuthenticationError(
      'GITHUB_TOKEN no está definido en las variables de entorno.'
    );
  }

  logInfo('Inicializando cliente de GitHub');

  octokitInstance = new Octokit({ auth: token});
  return octokitInstance;
}