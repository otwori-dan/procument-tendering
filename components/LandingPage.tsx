"use client";
import Link from "next/link"
import { Button } from "./ui/button"
import { JSX, SVGProps, use, useEffect, useState } from "react"
import { Badge } from "./ui/badge";
import { ArrowRight, LayoutDashboard, Loader2, ShieldCheckIcon, Trash, TrashIcon } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";

interface Tender {
  id: number;
  name: string;
  description: string;
  postBy: string;
  postDate: string;
  expiryDate: string;
  adminId: number;
  createdAt: string;
  updatedAt: string;
  OpeningVenue: string;
  ClosingTime: string;
  PublicLink: string;
  DaysToClose: number;
  OCID: string;
  procurementMethod: string;
  FinancialYear: string;

}

export default function Component() {
   const router = useRouter();
  const [isShowing, setIsShowing] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [username, setUsername] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [Adminpriviledge, setAdminPriviledge]= useState< string | null>(null);
    const [deleting, setDeleting] = useState(false);


   //format date 2024-03-11T19:30:06.290Z to March 11, 2024
   function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return formattedDate;
}

useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    const { username } = JSON.parse(user);
    setUsername(username);
  }
}
, [
  router
]);

useEffect(() => {
  const user = localStorage.getItem("user");
  const priviledge = localStorage.getItem("priviledge");
  if (user) {
    const {  username, token, userId } = JSON.parse(user);
    setUsername(username);
    setToken(token);
    setUserId(userId);
  }
  if (priviledge) {
    setAdminPriviledge(priviledge);
  }
}
, [
  router
]);

// Check user priviledge from the local storage
useEffect(() => {
  const priviledge = localStorage.getItem("priviledge");
  if (priviledge) {
    setAdminPriviledge(priviledge);
  }
}
, [
  router
]);

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("applicantId");
  localStorage.removeItem("priviledge");
  setUsername("");
  setToken(null);
  setUserId(null);
  setAdminPriviledge("");
  router.push("/");
  setAdminPriviledge("");
}


const goToDashboard = () => {
  return () => {
    if (Adminpriviledge === "admin") {
      router.push("/Admin.Dashboard");
    } else {
      router.push("/dashboard");
    }
  }
}




  
  // fetch tenders from the server
  useEffect(() => {
    setLoading(true);
    fetch("/api/products/tenders")
      .then((response) => response.json())
      .then((data) => {
        setTenders(data);
        console.log("Tenders", data);
        
        setLoading(false);
      }).catch((error:any) => {
        setError(error.message);
        console.error("Error fetching tenders", error);
        setLoading(false);
      }
      );
  }
  , []);


      const tendersData = [
        {
          id:1,
          title: "Maize",
          postedBy: "Farmers Union",
          postDate: "February 1, 2024",
          expiryDate: "March 1, 2024",
          description: "The Farmers Union is seeking suppliers for high-quality maize. The maize should meet specific standards for freshness, size, and moisture content. Suppliers are required to provide samples for testing before the expiry date."
        },
        {
          id:2,
          title: "Beans",
          postedBy: "Agricultural Co-op",
          postDate: "January 15, 2024",
          expiryDate: "February 15, 2024",
          description: "The Agricultural Co-op is inviting bids for the supply of beans. Suppliers must guarantee the quality and origin of the beans. Bidders are encouraged to provide certifications and documentation to support their offers before the expiry date."
        },
        {
          id:3,
          title: "Wood",
          postedBy: "Lumber Yard",
          postDate: "January 20, 2024",
          expiryDate: "February 20, 2024",
          description: "The Lumber Yard is soliciting proposals for the purchase of wood products. The wood should be sourced sustainably and meet specified dimensions and quality standards. Interested parties are required to submit detailed proposals outlining pricing, delivery schedules, and product specifications before the expiry date."
        },
        {
          id:4,
          title: "Metal",
          postedBy: "Metal Fabrication Company",
          postDate: "February 5, 2024",
          expiryDate: "March 5, 2024",
          description: "The Metal Fabrication Company is accepting bids for the supply of metal materials. The materials must be suitable for various fabrication processes and meet industry standards for strength and durability. Suppliers are encouraged to provide samples and certifications to demonstrate product quality before the expiry date."
        }
      ];
      
  return (
    <div>
      <div className="relative bg-white dark:bg-gray-800">
    {isShowing &&  (
        <div className="fixed inset-0 z-50
         bg-black bg-opacity-50 flex items-center justify-center
          transition-all duration-500 
          backdrop-filter backdrop-blur-sm
          h-screen w-screen overflow-y-auto
          ease-in-out

         ">
          <div className="bg-white p-4 rounded-lg
             sm:w-1/3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4
              shadow-lg relative overflow-hidden
          ">
            <Button onClick={() => setIsShowing(false)} className="absolute rounded-lg p-1 top-0.5 right-0.5 z-20">
              <svg
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              </Button>
            {/* login as admin or applicant */}
            <div className="flex items-center justify-between flex-row mt-5 gap-x-4">
            <div className="flex flex-col items-center justify-center gap-y-4 p-4 w-full h-48  dark:bg-gray-800 rounded-lg text-sm  relative overflow-hidden">
             
                 Admin Login
           
              <a href="/AdminLogin" className=" no-underline">
              <Button >Login /admin</Button>
               </a>
                     
            </div>
      
         
            <div className="flex flex-col items-center justify-center gap-y-4 p-4 w-full h-48  dark:bg-gray-800 rounded-lg  text-sm relative overflow-hidden">

             
                 <p className=" text-center">Applicant Login</p>
            
              <a href="/ApplicantLogin" className=" no-underline">
              <Button >Login /applicant</Button>
              </a>
            </div>

            </div>
            <Separator orientation="horizontal" className="" />
         
  
        <div className="flex flex-col items-center justify-center gap-y-4 p-4">
          <a href="/Signup" className=" no-underline">
            <Button >Sign Up As Applicant</Button>
          </a>
          <a href="/admin-signup" className=" no-underline">
            <Button >Sign Up As    Admin</Button>
          </a>
          
          </div>
           {/* c */}
           <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Tender App
            &copy;
           copyright 2024
           </p>
          </div>
         
        </div>
        
        
      )}
      
    </div>
      <header className="px-4 lg:px-6  h-16 flex items-center bg-transparent dark:bg-gray-800 opacity-80 shadow-sm top-0 z-40 fixed w-full
      transition duration-300 ease-in-out
      backdrop-filter backdrop-blur-lg

      ">
    <Link className="flex items-center justify-center" href="#">
      <ShieldCheckIcon className="h-8 w-8 text-black" />
      <span className="sr-only">Acme Inc</span>
    </Link>
    <div className="ml-auto flex items-center gap-4 sm:gap-6">
      {
        username && (
          <a className="text-sm font-bold
          bg-black text-white rounded-lg p-2 hover:bg-gray-900
           cursor-pointer 
            sm:flex hidden items-center justify-center gap-x-2

           "
           onClick={goToDashboard()}
            >
          
            <span>
            
             {
                checking ? (
                  <p>Checking...</p>
                ):(
                  Adminpriviledge ? (
                    <p>Admin Dashboard</p>
                  ):(
                    <p>Applicant Dashboard</p>
                  )
                )
             }
             
            </span>
            <LayoutDashboard className="h-6 w-6" />
          </a>
        )
      }
    
      <Link className="text-sm font-medium hover:underline underline-offset-4" href="/About">
        About
      </Link>
      <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
        Contact
      </Link>
      <Button
      onClick={() => setIsShowing(true)}
       variant="outline">Login</Button>
       {
          username && (
            <Button onClick={logout} variant="outline">Logout</Button>
          )
       }
    </div>
  </header>
  <section className="w-full py-20 md:py-24 lg:py-28 xl:py-32">
  {
    !loading && !error && (
      <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore Tenders.</h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Here are the latest tenders available for bidding. Click on a tender to view more details and submit your
            bid.
          </p>
        </div>
      </div>
      <div className=" flex justify-center items-center mx-auto max-w-md">
      {
                    deleting && (
                      <div className="flex justify-center items-center mx-auto flex-col">
                       <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Deleting </span>
                      </div>
                     
                    )
                    }
      </div>
      <div className="mx-auto grid sm:max-w-5xl max-w-full items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
        {tenders.map((tender, index) => (
          <div key={index} className="flex flex-col gap-2 shadow-lg p-6 bg-white dark:bg-gray-800 rounded-lg sm:min-w-[300px] min-w-full min-h-[350px]">
            <h3 className="text-xl font-bold">{tender.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Posted by {tender.postBy} on {formatDate(tender.postDate)}</p>
            <span className="text-sm text-gray-500 dark:text-gray-400">Expiry Date: <Badge>
              {formatDate(tender.expiryDate)}
              </Badge></span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {tender.description}
            </p>
            {/* status */}
             <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
              <Badge>open</Badge>
             </div>

             <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Opening Venue:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tender.OpeningVenue}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Closing Time:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tender.ClosingTime}</p>
              </div>
              {/* <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Days To Close:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tender.DaysToClose}</p>
              </div> */}
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">OCID:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tender.OCID}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Procurement Method:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tender.procurementMethod}</p>
              </div>
           
    <div className="flex items-center justify-between gap-2">
      <>
      <a
              className="inline-flex   flex-row gap-x-2  h-8 items-center  "
              href={`/tender/${tender.id}`}
            >
            <div className="flex items-center gap-2
            underline-offset-1 underline
            ">
            <p>View Details</p>
             <p> <ArrowRight className="h-4 w-4" /></p>

            </div>
         {/* delete */}
            
        
            </a>
            {
              Adminpriviledge && (
                <div className="flex items-center gap-2">
                <Button
                className="flex items-center gap-1 no-underline"
                  onClick={() => {
                    setDeleting(true);
                    fetch(`/api/products/admin/tenders/deleteTender`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ tenderId: tender.id }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log("Tender deleted", data);
                         tenders.splice(index, 1);
                          setTenders(tenders);
                          setDeleting(false);
                      })
                      .catch((error) => {
                        setDeleting(false);
                        console.error("Error deleting tender", error);
                      });
                  }}
                  variant="outline"
                >
                 
                        <div className="flex text-red-600 items-center gap-1">
                          <span>Delete</span>
                      
                        <TrashIcon className="h-6 w-6" />
                        </div>
                    
                      
                    
                  
                </Button>
              </div>
              )

            }
      </>
         
          </div>
          </div>
        ))}
      </div>
    </div>
    )
  }
  {
    loading && (
      <div className="flex items-center justify-center h-96 gap-1 flex-col">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading tenders...</p>
      </div>
    )
  }
  {
    error && (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }
    </section>
    <footer className="py-4 px-6 bg-white dark:bg-gray-800">
        <div className="text-center text-gray-600 dark:text-gray-300">
          © 2024 Tender App. All rights reserved.
        </div>
      </footer>
    </div>

  )
}



function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    )
  }
  