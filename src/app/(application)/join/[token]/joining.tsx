"use client"

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    redirectURL: string
}

const Joining = (props: Props) => {

    const router = useRouter()

    React.useEffect(() => {
		if (!props.redirectURL) {
			router.push("/");
			return;
		}
		router.push(props.redirectURL);
	}, [props.redirectURL]);


  return (
        <div className="flex h-screen items-center justify-center">
			<p className="flex items-center gap-2">
				<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				Redirecting
			</p>
		</div>
  )
}

export default Joining