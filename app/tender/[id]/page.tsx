"use client";
// pages/tender/[id].tsx

import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import UploadProfile from "@/components/Upload"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {  useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface TenderData {
    id: number;
    name: string;
    postBy: string;
    postDate: string;
    expiryDate: string;
    description: string;
    OpeningVenue: string;
    ClosingTime: string;
    PublicLink: string;
    DaysToClose: number;
    OCID: string;
    procurementMethod: string;
    FinancialYear: string;
    bankStamentUrlAttachment: string;
    subModules: string[] | null;

    }

    type Props = {
        params:{
            id: string;
        }
      };

      /* const tenderApplication = {
  applicantInformation: {
    companyName: 'Your Company Name',
    contactPerson: 'Your Full Name',
    contactEmail: 'Your Email Address',
    contactPhone: 'Your Phone Number',
  },
  projectDetails: {
    projectTitle: 'Title of the Web App Development Project',
    projectDescription: 'Summarize the project in a few sentences',
  },
  proposalSections: {
    projectUnderstanding: 'Your response to the client\'s requirements and objectives',
    technicalProposal: 'Details about the technical architecture, technologies, and methodologies',
    timeline: 'Proposed project timeline with milestones',
    budget: 'Detailed breakdown of costs and payment terms',
  },
  closingStatement:
 */
export default function TenderPage({params}: Props) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(null);
  const [applicantId, setApplicantId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cloudinaryImgUrl, setCloudinaryImgUrl] = useState('')
  const [isUploadingError, setIsUploadingError] = useState(false)
  const [isUploadingSuccess, setIsUploadingSuccess] = useState(false)
  const [uploadErrorMessage, setUploadErrorMessage] = useState('')
  const [selectedSubModules, setSelectedSubModules] = useState<string[]>([]);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
  const [proposalPreviewImg, setProposalPreviewImg] = useState<string | ArrayBuffer | null>('')
  const [proposalCloudinaryImgUrl, setProposalCloudinaryImgUrl] = useState('')
  const [isProposalUploadingError, setIsProposalUploadingError] = useState(false)
  const [isProposalUploadingSuccess, setIsProposalUploadingSuccess] = useState(false)
  const [proposalUploadErrorMessage, setProposalUploadErrorMessage] = useState('')
  const [proposalUploadSuccessMessage, setProposalUploadSuccessMessage] = useState('')

    const [formData, setFormData] = useState({
      status: "pending",
      date: new Date().toISOString(),
      applicantId : "",
      tenderId: 0,
      proposal: "",
      NID: "",
      amount: 0,
      duration: 0,
      completionDate : new Date().toISOString(),
      kraPin: "",
      location: "nairobi",
      phoneNumber: "",
      companyName: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      projectTitle: "",
      projectDescription: "nothing",
      projectUnderstanding: "nothing..",
      companyWebsite: "",
      timeline: "",
      closingStatement: "nothing",
      bankStamentUrlAttachment: "",
      subModules: selectedSubModules

      });

      const [tenderData, setTenderData] = useState<TenderData>({
        id: 0,
        name: "",
        postBy: "",
        postDate: "",
        expiryDate: "",
        description: "",
        OpeningVenue: "",
        ClosingTime: "",
        PublicLink: "",
        DaysToClose: 0,
        OCID: "",
        procurementMethod: "",
        FinancialYear: "",
        bankStamentUrlAttachment: "",
        subModules: []
      });

      
      React.useEffect(() => {
        if (cloudinaryImgUrl) {
          setCloudinaryImgUrl(cloudinaryImgUrl);
        }
      }, [cloudinaryImgUrl]);
      useEffect(() => {
      // Get the applicantId from localStorage
      const applId = localStorage.getItem("applicantId");
      if (applId) {
        setApplicantId(JSON.parse(applId));
        console.log("applicantId", applicantId);
        
      }
      }
      , [
        formData,
        router
      ]);
      


      const { id } = params;
      const tenderId = id;

      const [loading, setLoading] = useState(false);


      function formatDate(dateString: string | number | Date) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate;
    }

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const selectedValue = e.target.value;
        setFormData ({
          ...formData,
          [e.target.name]: selectedValue
        });

      };
      const handleSubModulesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist(); // Persist the event object
        const { value, checked } = event.target;

        // Update the selectedSubModules based on the checkbox status
        if (checked) {
          setSelectedSubModules((prevSelected) => [...prevSelected, value]);
      
          
        } else {
          setSelectedSubModules((prevSelected) => prevSelected.filter((subModule) => subModule !== value));
        }
      };
      
      const handleUploadSuccess = (uploadedUrl: string) => {
        setCloudinaryImgUrl(uploadedUrl);
        /* set bankStatement TO UPLOADED URL */
        setFormData({
          ...formData,
          bankStamentUrlAttachment: uploadedUrl
        });
        setIsUploadingSuccess(true);
        // toast.success('successfully converted', {
        //   style: {
        //     border: '1px solid #713200',
        //     padding: '16px',
        //     color: '#713200',
        //   },
        //   duration: 4000,
        //   iconTheme: {
        //     primary: '#713200',
        //     secondary: '#FFFAEE',
        //   },
          
        // });
        setTimeout(() => {
          setIsUploadingSuccess(false);
         
        }, 3000);
      };
      const handleProposalUploadSuccess = (uploadedUrl: string) => {
        console.log("uploadedUrl", uploadedUrl);
        
        setProposalCloudinaryImgUrl(uploadedUrl);
        /* set bankStatement TO UPLOADED URL */
        setFormData({
          ...formData,
          proposal: uploadedUrl
        });
        setIsProposalUploadingSuccess(true);
        // toast.success('successfully converted', {
        //   style: {
        //     border: '1px solid #713200',
        //     padding: '16px',
        //     color: '#713200',
        //   },
        //   duration: 4000,
        //   iconTheme: {
        //     primary: '#713200',
        //     secondary: '#FFFAEE',
        //   },
          
        // });
        setTimeout(() => {
          setIsProposalUploadingSuccess(false);
         
        }, 3000);
      };

      const browseProposalPdfOnly = (e: any) => {
        const file = e.target.files[0]
         // Check if the file is a pdf
          if (file && file.type !== "application/pdf") {
            toast.error('Only PDF files are allowed', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              duration: 4000,
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
              
            });
            setProcessing(false);
            setProposalCloudinaryImgUrl("");
            setProposalPreviewImg("");

            return;
          }
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setProposalPreviewImg(reader.result)
          }
          reader.readAsDataURL(file)

        }
      }
  
      const browseImageOnly = (e: any) => {
        const file = e.target.files[0]
         // Check if the file is a pdf
         if (file && file.type !== "application/pdf") {
          toast.error('Only PDF files are allowed', {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            duration: 4000,
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            },
            

          });

          setProcessing(false);
          setCloudinaryImgUrl("");
          setPreviewImg("");
          return;
        }
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviewImg(reader.result)
          }
          reader.readAsDataURL(file)
        }
      }

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        // Submit form logic
        console.log(formData);
        if(!formData.bankStamentUrlAttachment){
          setError("Please upload your bank statement");
          setProcessing(false);
          return;
        }
        // if (!formData.NID || !formData.amount || !formData.proposal || !formData.duration || !formData.completionDate || !formData.kraPin || !formData.location) {
        //   setError("All fields are required")
        //   return;
        // }
      try {
        let res = await fetch("/api/application/create", {
          method: "POST",
          body: JSON.stringify({...formData, tenderId, applicantId}),
          headers: {
            "Content-Type": "application/json"
          }
        });
        let data = await res.json();
         if(data.status === 200){
          setSuccess(data.message);
          setProcessing(false);

          // Clear form data
          setFormData({
            status: "pending",
            date: new Date().toISOString(),
            applicantId : "",
            tenderId: 0,
            proposal: "",
            NID: "",
            amount: 0,
            duration: 0,
            completionDate : new Date().toISOString(),
            kraPin: "",
            location: "nairobi",
            phoneNumber: "",
            companyName: "",
            contactPerson: "",
            contactEmail: "",
            contactPhone: "",
            projectTitle: "",
            projectDescription: "",
            projectUnderstanding: "nothing..",
            companyWebsite: "",
            timeline: "null",
            closingStatement: "",
            bankStamentUrlAttachment: "",
            subModules: []
          });
          setTimeout(() => {
            setSuccess(null);
            setError(null);
            router.push("/dashboard");
          }
          , 5000);
        }
        if(data.status === 400){
          setError(data.message);
          setProcessing(false);
          setTimeout(() => {
            setSuccess(null);
            setError(null);
          }
          , 5000);
        }
        if(data.status === 500){
          setError(data.message);
          setProcessing(false);
          setTimeout(() => {
            setSuccess(null);
            setError(null);
          }
          , 5000);
        }
      } catch (error: any) {
        setError(error.message);
        setProcessing(false);
        setTimeout(() => {
          setSuccess(null);
          setError(null);
        }
        , 5000);
        
      }
      };
  // Fetch tender data using id

  // fetch tender data from the server -  POST /api/products/tender
   useEffect(() => {
    setLoading(true);
    fetch("/api/products/tender", {
        method: "POST",
        body: JSON.stringify({tenderId}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setTenderData(data);
        // set formData.subModules to data.subModules
        setFormData({
          ...formData,
          subModules: data?.subModules
        });
        setLoading(false);
      }).catch((error:any) => {
        console.error("Error fetching tender", error);
        setLoading(false);
      }
      );
    
  }
  , []);

  return (
    <Layout>
        <>
       <div  className="flex items-center justify-start flex-row gap-x-3">
       
          <div className="">
        Tender ID: <strong> {tenderData.id}</strong>
         </div>
        {/* go back */}
        
       </div>
       
       
     {
          loading ? (
              <div className="flex items-center justify-center flex-col space-y-2">
                  <Loader2 size="50" className="animate-spin" />
                  <span className="text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
          ) : (
              <>
               <div className="container mx-auto py-12 px-2 sm:px-6 lg:px-16 sm:space-x-10">
        <h1 className="text-4xl font-bold mb-6">{tenderData.name}</h1>
        <div className="flex gap-x-6 justify-between flex-col sm:flex-row text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>Posted by  {tenderData.postBy.split("@")[0]}  {"  "} {" "}
            on 
               <i className="text-sm"> {formatDate(tenderData.postDate)}</i>
            </p>
         
          <i>Expiry Date: {formatDate(tenderData.expiryDate)}</i>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-base text-gray-700 dark:text-gray-300">{tenderData.description}</p>
        </div>
        
      </div>

      <div className="container mx-auto py-12 px-2 sm:px-6 lg:px-16 sm:space-x-10">
        <h2 className="text-2xl font-bold mb-6">Tender Details</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex gap-x-6 justify-between flex-col sm:flex-row text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Opening Venue: {tenderData.OpeningVenue}</p>
          </div>
          <div className="flex gap-x-6 justify-between flex-col sm:flex-row text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Public Link: <a 
            className="text-blue-500 dark:text-blue-400 hover:underline text-lg italic underline underline-offset-2"
            href={tenderData.PublicLink} target="_blank" rel="noopener noreferrer">Public Link</a></p>
            <p>Days to Close: {tenderData.DaysToClose}</p>
          </div>
          <div className="flex gap-x-6 justify-between flex-col sm:flex-row text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>OCID: {tenderData.OCID}</p>
            <p>Procurement Method: {tenderData.procurementMethod}</p>
          </div>
          <div className="flex gap-x-6 justify-between flex-col sm:flex-row text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Financial Year: {tenderData.FinancialYear}</p>
          </div>
        </div>
      </div>
              </>
          )
     }
      <h3 className="text-2xl font-bold mb-6">Submit Your Proposal</h3>
      {
          success && (
           
                        <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
                        <div className="bg-green-100 border my-2 border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Success! </strong>
                      <span className="block sm:inline"> {success}</span>
                    </div>
                      </div>
          )
        }
        {
          error && (
            
            <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
            <div className="bg-red-100 border my-2 border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
          )
        }
        
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-16 space-x-16">
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold">Request Proposal</h2>
          <div className="mb-4">
            <Label htmlFor="NID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ID Number / Passport
            </Label>
            <Input 
            required
             type="text" name="NID" id="NID" value={formData.NID} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name
            </Label>
            <Input 
            required
            type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
     {/* subModules */}
    {
     tenderData.subModules && tenderData.subModules.length > 0 && (<>
     
      <Card className="mb-4 p-2">
         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Sub Modules
          </label>
      {formData.subModules && Array.isArray(formData.subModules) && (
        
        <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 p-2">
       
         {
          !loading && (<>
           {formData.subModules.map((subModule, index) => (
            <div key={index} className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-4 w-4 border-gray-300 dark:border-gray-600 rounded"
                name="subModules"
                value={subModule}
                id={subModule}
                checked={selectedSubModules.includes(subModule)}
                onChange={handleSubModulesInputChange}
              />
              <label htmlFor={subModule} className="text-gray-700 dark:text-gray-300">
                {subModule}
              </label>
            </div>
          ))}
          </>)

         }
         {
            loading && (
              <div className="flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Loading...</span>
                <Loader2 size="20" className="animate-spin" />
              </div>
            )
         }

        </CardDescription>
      )}
    </Card>

     </>)
    }
    
          <div className="mb-4">
            <Label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Person
            </Label>
            <Input 
            required
            type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        {/* company webs */}
        <div className="mb-4">
            <Label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Website
            </Label>
            <Input 
            required
            type="text" name="companyWebsite" id="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <Label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Email
            </Label>
            <Input 
            required
            type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          
         <div className="mb-4">
          <label htmlFor="Attach Bank Statement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Attach Bank Statement
          </label>
          <div className="space-y-2">
                  {
                    /* is uploading */
                    isUploading && (
                      /* loading progress */
                      <div className="flex items-center justify-center w-full h-10 bg-gray-300 dark:bg-gray-800 animate-pulse">
                        <span className="text-gray-500">{uploadProgress}%</span>
                      </div>
                    )
                  }
                  {
                    /* is uploading error */
                    isUploadingError && (
                      <span className="text-red-500">{uploadErrorMessage}</span>
                    )
                  }
                  {
                    /* is uploading success */
                    isUploadingSuccess && (
                      <span className="text-green-500">{uploadSuccessMessage}</span>
                    )
                  }
                  
            
                  <Label htmlFor="Attach Bank Statement">

                  </Label>
                  <Input id="Attach Bank Statement"
                    onChange={browseImageOnly}
                   placeholder="Attach your Bank Statement" type="file"
                    accept="*"
                    />
                </div>
              
              <Card className="w-full p-2 flex justify-center items-center flex-row mx-auto gap-x-4">
                {
                  previewImg && (
                   <UploadProfile previewImg={previewImg}  onUploadSuccess={handleUploadSuccess}/>
                  )
                }
                {
                  cloudinaryImgUrl && (
                  <a 
                  className="underline text-blue-500 dark:text-blue-400 hover:underline"
                  href={cloudinaryImgUrl} 
                  target="_blank">
                  <a className="w-full
                  flex items-center justify-center
                  group
                  " >
                      <span>
                        your bank statement has been uploaded
                      </span>
                      <Eye className="group-hover:animate-bounce w-6 h-6 ml-2" />
                  </a>
                  </a>
                  )
                }
              </Card>
              </div>
           
          
          <div className="mb-4">
            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget (Ksh)
            </Label>
            <Input
            required
             type="number" name="amount" id="amount" value={formData.amount} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <Label htmlFor="kraPin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              KRA Pin
            </Label>
            <Input 
            required
            type="text" name="kraPin" id="kraPin" value={formData.kraPin} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <Label htmlFor="proposal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Proposal</Label>
            <Input id="Attach Bank Statement"
                    onChange={browseProposalPdfOnly}
                   placeholder="Attach your Bank Statement" type="file"
                    accept="*"
                    />
          </div>
          <Card className="w-full p-2 flex justify-center items-center flex-row mx-auto gap-x-4">
                {
                  proposalPreviewImg && (
                   <UploadProfile previewImg={proposalPreviewImg}  onUploadSuccess={handleProposalUploadSuccess}/>
                  )
                }
                {
                  proposalCloudinaryImgUrl && (
                  <a 
                  className="underline text-blue-500 dark:text-blue-400 hover:underline"
                  href={proposalCloudinaryImgUrl} 
                  target="_blank">
                  <a className="w-full
                  flex items-center justify-center
                  group
                  " >
                      <span>
                        your proposal has been uploaded
                      </span>
                      <Eye className="group-hover:animate-bounce w-6 h-6 ml-2" />
                  </a>
                  </a>
                  )
                }
              </Card>
              
          <div className="mb-4">
            <Label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title
            </Label>
            <Input 
            required
            type="text" name="projectTitle" id="projectTitle" value={formData.projectTitle} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* <div className="mb-4">
            <Label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Description
            </Label>
            <Textarea 
            required
            name="projectDescription" id="projectDescription" value={formData.projectDescription} onChange={handleInputChange} rows={5} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></Textarea>
          </div> */}
          {/* <div className="mb-4">
            <Label htmlFor="projectUnderstanding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What is your understanding of the project?
            </Label>
            <Textarea 
            required
            name="projectUnderstanding" id="projectUnderstanding" value={formData.projectUnderstanding} onChange={handleInputChange} rows={5} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></Textarea>
          </div>
           */}
          {/* <div className="mb-4">
            <Label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tell us about your timeline
            </Label>
            <Textarea 
            required
            name="timeline" id="timeline" value={formData.timeline} onChange={handleInputChange} rows={5} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></Textarea>
          </div> */}
         

          {/* <div className="mb-4">
            <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              De
            </Label>
            <Input
            required
             type="number" name="duration" id="duration" value={formData.duration} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div> */}
          <div className="mb-4">
            <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </Label>
            <Input 
            required
            type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <Label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              When can you complete the project?
            </Label>
            <Input 
            required
            type="date" name="completionDate" id="completionDate" value={formData.completionDate} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          
          {/* <div className="mb-4">
            
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </Label>
            <select
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required name="location" id="location" value={formData.location} 
              className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
              <option value="eldoret">Eldoret</option>
              <option value="nakuru">Nakuru</option>
              <option value="kisii">Kisii</option>
              <option value="nyeri">Nyeri</option>
              <option value="meru">Meru</option>
              <option value="thika">Thika</option>
              <option value="malindi">Malindi</option>
              <option value="kitale">Kitale</option>
              <option value="garissa">Garissa</option>
              <option value="embu">Embu</option>
              <option value="nyahururu">Nyahururu</option>
              <option value="kericho">Kericho</option>
              <option value="vihiga">Vihiga</option>
              <option value="migori">Migori</option>
              <option value="bomet">Bomet</option>
              <option value="isiolo">Isiolo</option>
              <option value="nanyuki">Nanyuki</option>
              <option value="narok">Narok</option>
              <option value="machakos">Machakos</option>
              <option value="lamu">Lamu</option>
              <option value="wajir">Wajir</option>
              <option value="busia">Busia</option>
              <option value="kakamega">Kakamega</option>
              <option value="moyale">Moyale</option>
              <option value="lodwar">Lodwar</option>
              <option value="maralal">Maralal</option>
              <option value="taveta">Taveta</option>
              <option value="kilifi">Kilifi</option>
              <option value="bondo">Bondo</option>
              <option value="webuye">Webuye</option>
              <option value="siaya">Siaya</option>
              <option value="lugari">Lugari</option>
              <option value="kabarnet">Kabarnet</option>
              <option value="luanda">Luanda</option>
              <option value="mumias">Mumias</option>
              <option value="eldama ravine">Eldama Ravine</option>
              <option value="mwingi">Mwingi</option>
              <option value="kiambu">Kiambu</option>
              <option value="nandi hills">Nandi Hills</option>
              <option value="kapsabet">Kapsabet</option>
              <option value="rongo">Rongo</option>
              <option value="kabarnet">Kabarnet</option>
              </select>

          </div> */}
          {/* <div className="mb-4">
            <Label htmlFor="closingStatement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Closing Statement
            </Label>
            <Textarea 
            required
            name="closingStatement" id="closingStatement" value={formData.closingStatement} onChange={handleInputChange} rows={5} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></Textarea>
            </div> */}
          <div className="flex justify-center">
           {
            /* requires applicantId  */
            applicantId ? (
              <Button type="submit"
            disabled={processing || !previewImg || !proposalPreviewImg}
             className="inline-flex  w-full justify-self-center items-center justify-center
            ">
              {
                processing ? (
                  <Loader2 size="20" className="animate-spin" />
                ) : (
                  "Submit Application"
                )
              }
            </Button>
            ) : (
              <Button disabled className="w-full">
                login as Applicant to submit
              </Button>
            )

           }
          </div>
        </form>
        </section>
        <Toaster />
        </>
    </Layout>
  );
}
