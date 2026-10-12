'use client'
import dynamic from 'next/dynamic'
const WorkerPortal = dynamic(() => import('../site/WorkerPortal'), {ssr:false,loading:()=> <p role="status">Loading worker portal…</p>})
export default function Portal(){return <WorkerPortal standalone />}
