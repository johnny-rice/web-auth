import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Form } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { useDoubleCheck, useIsPending } from '#app/utils/misc.tsx'
import { redirectWithToast } from '#app/utils/toast.server.ts'

export const handle = {
	breadcrumb: <Icon name="lock-open-1">Disable</Icon>,
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	// 🐨 get the userId from this:
	await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	// 🐨 delete the user's twoFAVerificationType verification from the database

	throw await redirectWithToast('/settings/profile/two-factor', {
		// 🐨 fix this title and description
		title: '2FA Disabled (jk)',
		description: 'This has not yet been implemented',
	})
}

export default function TwoFactorDisableRoute() {
	const isPending = useIsPending()
	const dc = useDoubleCheck()

	return (
		<div className="mx-auto max-w-sm">
			<Form method="POST">
				<AuthenticityTokenInput />
				<p>
					Disabling two factor authentication is not recommended. However, if
					you would like to do so, click here:
				</p>
				<StatusButton
					variant="destructive"
					status={isPending ? 'pending' : 'idle'}
					disabled={isPending}
					{...dc.getButtonProps({
						className: 'mx-auto',
						name: 'intent',
						value: 'disable',
						type: 'submit',
					})}
				>
					{dc.doubleCheck ? 'Are you sure?' : 'Disable 2FA'}
				</StatusButton>
			</Form>
		</div>
	)
}
