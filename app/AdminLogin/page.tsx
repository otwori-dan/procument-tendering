"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout"

export default function Component() {
   const router = useRouter()
    const [notify, setNotify] = useState('');
     const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const [processing, setProcessing] = useState(false);
    

      const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(!email || !password){
          setNotify('All fields are required');
          return;
        }
        setProcessing(true);
        // Add your logic for form submission here
        //remove priviledge from local storage
        localStorage.removeItem('priviledge');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('Form submitted:', email, password);
        const data = {
          email: email,
          password: password
        }
       try {
        let res = await fetch('/api/auth/admin/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        let response = await res.json()

        setNotify(response.message);

        if(response.message === 'ok'){
          console.log(response);
          
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', JSON.stringify(response.token));
            
            setNotify('Login successful');

            setProcessing(false);
            setTimeout(() => {
              localStorage.setItem('adminId', response.user.id);
              localStorage.setItem('postBy', response.user.username);
              localStorage.setItem('adminEmail', response.user.email);
              //priviledge set true
              localStorage.setItem('priviledge', 'admin');
              router.push('/Admin.Dashboard')
            }
            , 100)
         
          setProcessing(false); 
        }
        if(response.status === 401){
          
          setNotify(response.message);
          setProcessing(false);
        }
        if(response.status === 400){

          
          setNotify(response.message);

          setProcessing(false);
        }
       } catch (error:any) {
        
      setNotify(error.message);
      setProcessing(false);
        
       }
       
      };
    
  return (
    <Layout>
       <div className="flex flex-col items-center justify-center  min-h-screen  dark:bg-gray-900">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Sign In As Admin</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" required type="email"  onChange={(e) =>  setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password"  onChange={(e) =>  setPassword(e.target.value)} />
        </div>
        {/* forgot pass */}
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center">
            <input id="remember" type="checkbox" className="w-4 h-4  text-black border-gray-300 rounded focus:ring-blue-500" />
            <Label htmlFor="remember" className="block ml-2 text-sm text-gray-900 dark:text-gray-100">Remember me</Label>
          </div>
          <div>
            <a href="/Resetpassword" className="text-sm  text-black hover:underline">Forgot your password?</a>
          </div>
        </div>
        
        <Button
        disabled={processing}
         className="w-full " type="submit">
        
          {
            processing ? (<>
             <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing</span>
            </>) : 'Login'
          }
        
        </Button>
        <div 
    className="flex items-center justify-center space-x-2"
   />
     
      </form>
      <div className="flex items-center justify-center gap-x-2">
     {
        notify && <div className=" text-center
        border border-dashed border-gray-500 p-2 rounded-md
        transition-all duration-300 ease-in-out
        ">{notify}</div>
       
     }
     </div>
    </div>
  </div> 
    </Layout>
  
  )
}

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}