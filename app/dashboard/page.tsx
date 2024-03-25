"use client";
import Layout from "@/components/Layout"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle, CircleEllipsis, CircleSlash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"

interface AppliedTender {
  id: string;
  name: string;
  status: string;
  completionDate: string;
  location: string;
  amount: string;
  kraPin: string;
  duration: string;
  proposal: string;
  applicantId: string;
}

export default function Component() {
  const router = useRouter();
  const [appliedTenders, setAppliedTenders] = useState<AppliedTender[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantId, setApplicantId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    //slice @ from email
    const user= localStorage.getItem("user")
    if (user) {
      setUsername(JSON.parse(user).username.split("@")[0]);
    } 
    const applId = localStorage.getItem("applicantId");
    if (applId) {
      setApplicantId(JSON.parse(applId));
      console.log("applicantId", applicantId);
      
  
    fetch("/api/application/applied", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicantId: JSON.parse(applId),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAppliedTenders(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      })  }
  }, [
    applicantId,
    router
  ]);

  return (
    <Layout>
          <div  className="flex items-center justify-start flex-row gap-x-3">
    
          <span className="">
           Dashboard
         </span>
        {/* go back */}
        
       </div>
       <section className="w-full py-6 md:py-5 lg:py-7 xl:py-8">
        {/* welcome username */}
        <div className="flex items-center justify-start flex-row gap-x-3 mx-7">
        <h1 className="sm:text-3xl text-sm font-bold">
          {
            new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"
          }
          ,</h1>
        <p className="sm:text-3xl text-sm text-gray-500 dark:text-gray-400">{username}</p>
      </div>
     {
      loading ? (
       <div className="flex flex-col items-center justify-center gap-4">
        <p>Loading applied tenders...</p>
        <div className="flex items-center justify-center">
          <Loader2 size={48}  className="animate-spin" />
        </div>
       </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <div className="flex items-center justify-center">
            <AlertCircle size={48} />
          </div>
        </div>
      ) : (
        <div className="container px-4 md:px-6">
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-1 lg:gap-12">
          {/* Map through the applied tenders and render each tender */}
          {appliedTenders.map((tender, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div
              /* border green if approved */
              style={{
                border: tender.status === "approved" ? "2px solid #10B981" 
                : tender.status === "pending" ? "2px solid #F59E0B" : "2px solid #EF4444"
              }}
               className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold">{tender.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {
                  tender.status === "approved" ? (
                    <Badge className="bg-green-500 dark:bg-green-400
                      gap-1
                    ">
                      <span>Approved</span>
                      <CheckCircle className=" h-4 w-4" />
                    </Badge>
                  ) : tender.status === "pending" ? (
                    <Badge className="bg-yellow-500  gap-x-2 py-2 dark:bg-yellow-400">
                      <span>Pre-qualified</span>
                      <CircleEllipsis className=" h-4 w-4" />
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-red-400">Rejected</Badge>
                  )
                }</p>
             <Card className="p-4 my-4 bg-gray-100 dark:bg-gray-700">
             <p className="text-sm text-gray-500 dark:text-gray-400">ApplicantID: {tender.applicantId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date: {tender.completionDate}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location: {tender.location}</p>
                {/* amount, krapin, duration */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount: {
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "KES",
                    }).format(parseInt(tender.amount))
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  KRA PIN: {tender.kraPin}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Duration: {
                    tender.duration === "1" ? "1 day" : `${tender.duration} days`
                  }
                </p>
                </Card >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold my-1">Proposal:</span>
                  <Card className="p-4 bg-gray-100 dark:bg-gray-700 my-3">
                    {tender.proposal}
                  </Card>
                </p>
                {/* <Link
                  className="inline-flex h-8 items-center underline underline-offset-2 underline-dotted underline-gray-900"
                  href="#"
                >
                  View Details
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
         
      )
     }
    </section>
    {
      appliedTenders.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center gap-4">
          <p>No applied tenders found</p>
          <div className="flex items-center justify-center">
            <CircleSlash2 size={48} />
          </div>

          <a href="/" className="text-blue-500 dark:text-blue-400 
          hover:text-blue-600 dark:hover:text-blue-500
          bg-blue-50 dark:bg-blue-900
          hover:bg-blue-100 dark:hover:bg-blue-800
          p-2 rounded-lg
          transition duration-300 ease-in-out
          ">Apply for a tender</a>
        </div>
      )
    }
    </Layout>
  )
}

