import {useState} from 'react'
import {request} from '../register/api'
import './site.css'

export default function AccountAccess({accountType='admin',loginUrl='/admin'}) {
  const [error,setError]=useState(''),[message,setMessage]=useState(''),[pending,setPending]=useState(false)
  const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[email,setEmail]=useState('')
  const token=new URLSearchParams(window.location.search).get('token'),reset=!!token
  async function submit(event) {
    event.preventDefault();if(pending)return;setError('');setMessage('')
    if(reset && password!==confirm){setError('Passwords must match.');return}
    setPending(true)
    try {const result=await request(`/api/account/${reset?'reset':'recover'}`,{method:'POST',body:reset?{token,password}:{email,accountType}});setMessage(result.data.message);setPassword('');setConfirm('')}
    catch(error){setError(error.message)} finally{setPending(false)}
  }
  return <main className="sr-auth sr-app"><h1>Grenrose account access</h1><h2>{reset?'Set your password':'Recover your account'}</h2>
    <p>Account links expire after 30 minutes and can be used once.</p>{error&&<p role="alert" className="sr-error">{error}</p>}{message&&<p role="status">{message}</p>}
    <form onSubmit={submit}>{reset?<><label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm password<input type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label></>:<label>Email<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      <button disabled={pending}>{pending?'Please wait…':reset?'Save password':'Send recovery email'}</button></form><a href={loginUrl}>Back to sign in</a></main>
}
