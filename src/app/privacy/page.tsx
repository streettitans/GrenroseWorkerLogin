'use client'
import dynamic from 'next/dynamic'
const Privacy = dynamic(() => import('../../site/Privacy'), {ssr:false})
export default function PrivacyPage(){return <Privacy returnLabel="Back to worker portal" returnUrl="/"/>}

