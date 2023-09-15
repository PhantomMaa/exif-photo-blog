'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cc } from '@/utility/css';
import ChecklistRow from '../components/ChecklistRow';
import { FiCheckSquare, FiExternalLink } from 'react-icons/fi';
import { BiCopy, BiRefresh } from 'react-icons/bi';
import IconButton from '@/components/IconButton';
import { toast } from 'sonner';
import InfoBlock from '@/components/InfoBlock';
import Checklist from '@/components/Checklist';

export default function SiteChecklistClient({
  hasTitle,
  hasDomain,
  hasPostgres,
  hasBlob,
  hasAuth,
  hasAdminUser,
  showRefreshButton,
  secret,
}: {
  hasTitle: boolean
  hasDomain: boolean
  hasPostgres: boolean
  hasBlob: boolean
  hasAuth: boolean
  hasAdminUser: boolean
  showRefreshButton?: boolean
  secret: string
}) {
  const router = useRouter();

  const [isPendingPage, startTransitionPage] = useTransition();
  const [isPendingSecret, startTransitionSecret] = useTransition();

  const refreshPage = () => {
    startTransitionPage(router.refresh);
  };
  const refreshSecret = () => {
    startTransitionSecret(router.refresh);
  };

  const renderLink = (href: string, text: string, external = true) =>
    <>
      <a {...{
        href,
        ...external && { target: '_blank', rel: 'noopener noreferrer' },
        className: cc(
          'underline hover:no-underline',
        ),
      }}>
        {text}
      </a>
      {external &&
        <>
          &nbsp;
          <FiExternalLink
            size={14}
            className='inline translate-y-[-1.5px]'
          />
        </>}
    </>;

  const renderCopyButton = (label: string, text: string, subtle?: boolean) =>
    <IconButton
      icon={<BiCopy size={15} />}
      className={cc(subtle && 'text-gray-300 dark:text-gray-700')}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast(
          `${label} copied to clipboard`, {
            icon: <FiCheckSquare size={16} />,
            duration: 4000,
          },
        );
      }}
    />;

  const renderEnvVar = (variable: string) =>
    <div
      key={variable}
    >
      <span className="inline-flex items-center gap-1">
        <span className={cc(
          'rounded-sm',
          'bg-gray-100 text-gray-500',
          'dark:bg-gray-800 dark:text-gray-400',
        )}>
          `{variable}`
        </span>
        {renderCopyButton(variable, variable, true)}
      </span>
    </div>;

  const renderEnvVars = (variables: string[]) =>
    <div className="py-1 space-y-1">
      {variables.map(renderEnvVar)}
    </div>;

  return (
    <div className="text-sm max-w-xl space-y-4">
      <Checklist title="Site content">
        <ChecklistRow
          title="Add title"
          status={hasTitle}
          isPending={isPendingPage}
        >
          Store in environment variable:
          {renderEnvVars(['NEXT_PUBLIC_SITE_TITLE'])}
        </ChecklistRow>
        <ChecklistRow
          title="Add custom domain"
          status={hasDomain}
          isPending={isPendingPage}
          optional
        >
          Store in environment variable:
          {renderEnvVars(['NEXT_PUBLIC_SITE_DOMAIN'])}
        </ChecklistRow>
      </Checklist>
      <Checklist title="Storage">
        <ChecklistRow
          title="Setup database"
          status={hasPostgres}
          isPending={isPendingPage}
        >
          {renderLink(
            'https://vercel.com/docs/storage/vercel-postgres/quickstart',
            'Create Vercel Postgres store',
          )}
          {' '}
          and connect to project
        </ChecklistRow>
        <ChecklistRow
          title="Setup blob store"
          status={hasBlob}
          isPending={isPendingPage}
        >
          {renderLink(
            'https://vercel.com/docs/storage/vercel-blob/quickstart',
            'Create Vercel Blob store',
          )}
          {' '}
          and connect to project
        </ChecklistRow>
      </Checklist>
      <Checklist title="Authentication">
        <ChecklistRow
          title="Setup auth"
          status={hasAuth}
          isPending={isPendingPage}
        >
          Store auth secret in environment variable:
          <InfoBlock className="my-1.5" padding="tight">
            <div className="flex items-center gap-4">
              <span>{secret}</span>
              <div className="flex items-center gap-0.5">
                {renderCopyButton('Secret', secret)}
                <IconButton
                  icon={<BiRefresh size={18} />}
                  onClick={refreshSecret}
                  isLoading={isPendingSecret}
                  spinnerColor="text"
                />
              </div>
            </div>
          </InfoBlock>
          {renderEnvVars(['AUTH_SECRET'])}
        </ChecklistRow>
        <ChecklistRow
          title="Setup admin user"
          status={hasAdminUser}
          isPending={isPendingPage}
        >
          Store admin email/password
          {' '}
          in environment variables:
          {renderEnvVars([
            'ADMIN_EMAIL',
            'ADMIN_PASSWORD',
          ])}
        </ChecklistRow>
        {showRefreshButton &&
          <div className="py-4 space-y-4">
            <button onClick={refreshPage}>
              Check
            </button>
          </div>}
      </Checklist>
      <div className="px-10 text-gray-500">
        Changes to environment variables require a redeploy
        or reboot of local dev server
      </div>
    </div>
  );
}
