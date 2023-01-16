import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ldapEscape from 'ldap-escape';
import * as ldap from 'ldapjs';

@Injectable()
export class LdapService {
  ldapEnabled: boolean;
  private ldapClient: ldap.Client;

  constructor(private readonly configService: ConfigService) {
    this.ldapEnabled = configService.get('LDAP_ENABLED') === 'true';
    if (!this.ldapEnabled) {
      console.info('LDAP service is not enabled');
      return;
    }

    this.ldapClient = ldap.createClient({
      url: this.configService.get('LDAP_URL'),
      bindDN: this.configService.get('LDAP_ADMIN_DN'),
      bindCredentials: this.configService.get('LDAP_ADMIN_PASSWORD'),
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.search(username);
    if (!user) return null;

    const bindSuccess = await this.bind(user.dn, password);
    if (!bindSuccess) return null;

    return user;
  }

  private async search(username: string) {
    const opts = {
      filter: ldapEscape.filter`uid=${username}`,
      scope: 'sub',
      attributes: ['dn', 'displayName'],
    } satisfies ldap.SearchOptions;

    return new Promise<ldap.SearchEntryObject>((resolve, reject) => {
      this.ldapClient.search(
        this.configService.get('LDAP_USER_BASE_DN'),
        opts,
        (err, res) => {
          if (err) reject(err);

          let found = false;
          res.on('searchEntry', (entry) => {
            found = true;
            resolve(entry.object);
          });
          res.on('error', (err) => {
            reject(err);
          });
          res.on('end', () => {
            if (!found) resolve(null);
          });
        },
      );
    });
  }

  private async bind(dn: string, password: string) {
    return new Promise((resolve) => {
      this.ldapClient.bind(dn, password, (err) => {
        if (err) {
          switch (err.name) {
            case 'InvalidCredentialsError':
              resolve(false);
              break;
            default:
              throw new InternalServerErrorException();
          }
        }
        resolve(true);
      });
    });
  }
}
