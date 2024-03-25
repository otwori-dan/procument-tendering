"use client";
import Layout from "@/components/Layout"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowLeft, CheckCircle, CircleEllipsis, Edit, Eye, Inbox, Loader, Loader2, PlusIcon, Trash, X, XIcon } from "lucide-react"
import Link from "next/link"
import React, { SetStateAction, use, useEffect, useState } from "react"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
// import Map from "@/components/map";
import { Separator } from "@/components/ui/separator";
import PDFReport from "@/components/PdfReport";
import PNGview from "../../components/PDFurl";
import { Switch } from "@/components/ui/switch";

interface Applicant {
  id: string;
  username: string;
  email: string;
  password: string;
  verificationToken: string;
  isVerified: boolean;
  verificationTokenExpiry: string | null;
  resetToken: string | null;
  resetTokenExpiry: string | null;
  profile_pic: string;
  createdAt: string;
  updatedAt: string;
}
/* add 
const tenderDetails = {
  OCID: 'ocds-5whusi-MMBE&MA/SDM/037/2023-2024',
  TenderNumber: 'MMBE&MA/SDM/037/2023-2024',
  FinancialYear: '2023-2024',
  ProcurementMethod: 'Request for Proposals',
  Category: 'Consultancy Services',
  SubmissionMethod: 'Written (Physical/Hard Copy)',
  OpeningVenue: 'Works Building, 3rd Floor, Boardroom',
  PublishedDate: 'Feb 20, 2024',
  CloseDate: 'Feb 29, 2024',
  TenderFee: 0,
  ClosingTime: '10:00 AM',
  PortalPublishDate: '2024 February 20, 21:38:16',
  DaysToClose: 9,
  PublicLink: 'https://tenders.go.ke/OneTender/166798'
};
*/
interface Tender {
  id: string;
  name: string;
  postBy: string;
  postDate: string;
  expiryDate: string;
  description: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  OpeningVenue : string;
  ClosingTime: string;
  PublicLink: string;
  DaysToClose: number;
  OCID : string;
  procurementMethod: string;
  FinancialYear: string;
  
}

interface Proposal {
  id: string;
  status: string;
  date: string;
  applicantId: string;
  tenderId: string;
  createdAt: string;
  updatedAt: string;
  proposal: string;
  NID: string;
  amount: string;
  duration: string;
  completionDate: string;
  kraPin: string;
  location: string;
  applicant: Applicant;
  tender: Tender;
  phoneNumber: string;
}

interface Application {
  id: string;
  status: string;
  date: string;
  applicantId: string;
  tenderId: string;
  createdAt: string;
  updatedAt: string;
  proposal: string;
  NID: string;
  amount: string;
  duration: string;
  completionDate: string;
  kraPin: string;
  location: string;
  applicant: Applicant;
  tender: Tender;
  phoneNumber: string;
  bankStamentUrlAttachment: string;
  subModules: string[];
  isDelivered: boolean;
  expiryDate: string;
}

type tenderLocs = {
  id: string;
  status: string;
  date: string;
  applicantId: string;
  tenderId: string;
  createdAt: string;
  updatedAt: string;
  proposal: string;
  NID: string;
  amount: string;
  duration: string;
  completionDate: string;
  kraPin: string;
  location: string;
  phoneNumber: string;
  longitude: string;
  latitude: string;
  tender:Tender
  expiryDate: string;
  applicant:Applicant
};

type tenderLocsArray = tenderLocs[];


export default function Component() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [postBy, setPostBy] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [username, setUsername] = useState("");
  const [fetching, setFetching] = useState(false);
  const [tenders, setTenders] = useState<Application[]>([]);
  const [tenderWithLocation, setTenderWithLocation] = useState<tenderLocsArray>([]);
  const [dataErrMsg, setDataErrMsg] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approveMessage, setApproveMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [approveErrMessage, setApproveErrMessage] = useState("");
  const [deleteErrMessage, setDeleteErrMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const apiKey ="0815e49688a348a9b7810f4371384a42"
  const [isSending, setIsSending] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [openPDF,setOpenPDF]=useState(false);
  const [updateDelivery, setUpdateDelivery] = useState<boolean>(false);
  const [proposalPdfUrl, setProposalPdfUrl] = useState("");
  const [openProposalPDF,setOpenProposalPDF]=useState(false);
  const [proposalPdf,setProposalPdf]=useState("");
  const [proposal,setProposal]=useState("");
  const [proposalDate,setProposalDate]=useState("");
  const [proposalStatus,setProposalStatus]=useState("");
  const [proposalApplicant,setProposalApplicant]=useState("");
  const handleCordinatesChange = (latitude: number, longitude: number) => {
    setCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      { latitude, longitude }
    ]);
  };

  const updateDeriveredStatus = (tend: Application) => {
    setUpdateDelivery(true);
    // call the server to update the delivery status
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          tenderId: tend.id
        }
      )
    }
    fetch('/api/products/admin/tenders/delivery', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.status === 200){
            setUpdateDelivery(false);
         
            setSelected(tend => {
              if(tend){
                return {
                  ...tend,
                  isDelivered: true
                }
              }
              return tend;
            }

           

            );

                 setViewModal(false);
          }
          if(data.status === 400){
            setUpdateDelivery(false);
          }
        });

        //trigger a refetch
        setTenders(tenders.map((tender) => {
          if(tender.id === tend.id){
            return {
              ...tender,
              isDelivered: true
            }
          }
          console.log("returned",tender);
          
          return tender;
        }));
       setTimeout(() => {
        window.location.reload();
       }, 2000);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTenders(tenders.map((tender) => {
        if (new Date(tender.completionDate) <= new Date(tender.expiryDate)) {
          return {
            ...tender,
            isDelivered: true
          };
        }
        return tender;
      }));
    }
    , 1000);
    return () => clearInterval(intervalId);
  }
 ,[
    tenders,selected
  ]);
  useEffect(() => {
    selected?.isDelivered && setTenders(tenders.map((tender) => {
      if(tender.id === selected.id){
        return {
          ...tender,
          isDelivered: true
        }
      }
      return tender;
    }
    ));
  }
  ,[
    selected
  ]);

 
  
  const [location, setLocation] = useState("");


  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     if (coordinates.length > 0) {
  //       const { latitude, longitude } = coordinates[0];
  //       const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;

  //       try {
  //         const response = await fetch(apiUrl);
  //         const data = await response.json();
  //         const results = data.results;
  // console.log(results);
  
  //         if (results && results.length > 0) {
            
  //           console.log("Location", results[0].formatted);
  //         }
  //         setLocation(results[0].formatted);
  //       } catch (error) {
  //         console.error('Error:', error);
  //       }
  //     }
  //   };
  
  //   fetchLocation();
  // }, [coordinates]);
  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     const locationPromises = coordinates.map(async ({ latitude, longitude }) => {
  //       const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;
  
  //       try {
  //         const response = await fetch(apiUrl);
  //         const data = await response.json();
  //         const results = data.results;
  //         let datas = []


  //           datas.push(results)
  //           // console.log("datas",datas);
            
  //         if (datas.length > 0){
  //           // console.log(`Location for (${latitude}, ${longitude}):`, results[0].formatted);
  //           // You might want to store or process this information accordingly
          
           
  //         }
  //       //   if(results[0].formatted !== 'Null Island'){
  //       //     setLocation(results[0].formatted);
  //       // }
  //       // else{
  //       //   return "Null"
  //       // }
  //       } catch (error) {
  //         console.error(`Error fetching location for (${latitude}, ${longitude}):`, error);
  //       }
  //     });
  
  //     await Promise.all(locationPromises);
  //   };
  
  //   fetchLocations();
  // }, [coordinates]);
  
  

/* 
 id: string;
  name: string;
  postBy: string;
  postDate: string;
  expiryDate: string;
  description: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  OpeningVenue : string;
  ClosingTime: string;
  PublicLink: string;
  DaysToClose: number;
  OCID : string;
  procurementMethod: string;
  FinancialYear: string;

*/

const handlePDFView = (tend:string) => {
  setOpenPDF(true);
  setPdfUrl(tend);
  
}

const handleProposalPDFView = (tend:string) => {
  setOpenProposalPDF(true);
  setProposalPdfUrl(tend);
  
}
const handleClosePDF = () => {
  setOpenPDF(false);
}
const calculateOCID = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const OCID = `ocds-${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
  return OCID;
}
const getClosingTime = () => {
  // Get the current date
  const currentDate = new Date();

  // Add 30 days to the current date
  const closingDate = new Date(currentDate);
  closingDate.setDate(currentDate.getDate() + 30);

  // Return the closing date
  return closingDate;
};



  
  const [formData, setFormData] = useState({
   name: '',
   description:"",
    postDate: new Date().toISOString(),
    expiryDate: "2024-04-01",
    postBy: postBy,
    adminId: adminId,
    OpeningVenue: "",
    
    ClosingTime: getClosingTime(),
    PublicLink: "https://main--rubys.netlify.app/",
    DaysToClose: 0,
    OCID : calculateOCID(),
    procurementMethod: "",
    FinancialYear: "2024-2025",
    subModules: [] as string[],


  });
  function calculateExpiryDate(postDate: Date): string {
    const expiryDate = new Date(postDate);
    const dateToExpire = formData && formData.expiryDate ? new Date(formData.expiryDate) : null;
  
    // Add null check before calculating the time difference
    const timeDifference = dateToExpire && postDate ? dateToExpire.getTime() - postDate.getTime() : 0;
  
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    expiryDate.setDate(expiryDate.getDate() + daysDifference);
    return expiryDate.toISOString();
  }
  useEffect(() => {
    const user= localStorage.getItem("user")
    if (user) {
      setUsername(JSON.parse(user).username.split("@")[0]);
    } 
  }
  ,[
    router
  ]);

  useEffect(() => {
     {/* update isDerivered to true is the completionDate doesnt exceed expiryDate */}
      const intervalId = setInterval(() => {
        setTenders(tenders.map((tender) => {
          if (new Date(tender.completionDate) <= new Date(tender.expiryDate)) {
            return {
              ...tender,
              isDerivered: true
            };
          }
          return tender;
        }));
      }
      , 1000);
      return () => clearInterval(intervalId);
    }
  ,[
    tenders
  ]);
  const addSubModule = () => {
    setFormData({
      ...formData,
      subModules: [...formData.subModules, ''] as string[], // Add an empty string for a new sub-module
    });
  };

  // const fetchLocation=()=>{
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
     
  //   }
  //   fetch('/api/products/admin/tenders/location', requestOptions)
  //       .then(response => response.json())
  //       .then(data => {
  //         // console.log("Applications with location",data);
  //         if(data.status === 200){
  //           setTenderWithLocation(data.data);
  //           //  map and destructor longitude and latitude
             
  //         }
  //         if(data.status === 400){
  //           setDataErrMsg(data.message);
  //         }
  //       }).catch((error:any) => {
  //         console.error('Error:', error.message);
  //       }
  //       );
  // }
  /* fetch application longitude, latitude and merge with updated Tender location */
  // useEffect(() => {
 
  //   fetchLocation()
  //   const intervalId = setInterval(() => {
  //     fetchLocation();
  //   }, 5000);
  //   return () => clearInterval(intervalId);
  // }
  // ,[
  //   router,
  //   adminId,
  //   tenders
  // ]);




  useEffect(() => {
    if(localStorage.getItem("adminId") && localStorage.getItem("postBy")){
      setAdminId(localStorage.getItem("adminId") as string);
      setPostBy(localStorage.getItem("postBy") as string);
      console.log(adminId, postBy);
      
    }
    if(!localStorage.getItem("adminId") && !localStorage.getItem("postBy")){
      // redirect to login
        router.push("/AdminLogin");
    }
  }
  ,[
    postBy,
    formData
  ]);
  
  const fetchTenders = async () => {
    setFetching(true);
    console.log("adminId", adminId);
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          adminId: adminId
        }
      )
    }
    fetch('/api/products/admin/tenders', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("Applications all tenders",data);
          if(data.status === 200){
            setFetching(false);
            setTenders(data.data);

          }
          if(data.status === 400){
            setFetching(false);
            setDataErrMsg(data.message);
          }
        
        }).catch((error:any) => {
          setDataErrMsg(error.message);
          setFetching(false);
          console.error('Error:', error.message);
        }
        ).finally(() => {
          setFetching(false);
          console.log("done");
        }
        );
  }
  // fetch applied tenders from the server
  useEffect(() => {
    if(!adminId) return;

    if(adminId === ""){
      setDataErrMsg("Admin ID not found");
      return;
    }
    if(adminId){
      fetchTenders();
    }
   
  
  }, [
    adminId,
    router
  ]);


     //format date 2024-03-11T19:30:06.290Z to March 11, 2024
     function formatDate(dateString: string | number | Date) {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return formattedDate;
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    // Submit form logic
    console.log(formData);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          name: formData.name,
          description: formData.description,
          postDate: formData.postDate,
          expiryDate: formData.expiryDate,
          postBy: postBy,
          adminId: adminId,
          OpeningVenue: formData.OpeningVenue,
          dateToExpire: calculateExpiryDate(new Date(formData.postDate)),
          ClosingTime: new Date(formData.ClosingTime).toISOString(),
          PublicLink: formData.PublicLink,
          DaysToClose: calculateDaysRemaining(formData.expiryDate),
          OCID : formData.OCID,
          procurementMethod: formData.procurementMethod,
          FinancialYear: formData.FinancialYear,
          subModules: formData.subModules

        }
      )
    }
    fetch('/api/products/create', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("the data",data);
          if(data.status === 201){
         
            setSuccessMessage(data.message);
            setProcessing(false);
            setFormData({
              name: '',
              description:"",
               postDate: new Date().toISOString(),
               expiryDate: "",
               postBy: localStorage.getItem("postBy") as string,
               adminId: localStorage.getItem("adminId") as string,
                OpeningVenue: "",
                ClosingTime: getClosingTime(),
                PublicLink: "",
                DaysToClose: 0,
                OCID : "",
                procurementMethod: "",
                FinancialYear: "",
                subModules: [] as string[],
             });

          }
          if(data.status === 400){
           
            setErrMessage(data.message);
            setProcessing(false);
          }
        });
  };
    // const tenders: Tender[] = [
    //     {
    //       id: "001",
    //       applicant: "John Doe",
    //       status: "Pending",
    //       name: "Website Redesign",
    //       date: "Feb 23, 2023"
    //     },
    //     {
    //       id: "002",
    //       applicant: "Alice Smith",
    //       status: "In Review",
    //       name: "Mobile App Development",
    //       date: "Mar 5, 2023"
    //     },
    //     {
    //       id: "003",
    //       applicant: "Jane Doe",
    //       status: "Approved",
    //       name: "E-commerce Platform Development",
    //       date: "Apr 10, 2023"
    //     },
    //     {
    //       id: "004",
    //       applicant: "Bob Johnson",
    //       status: "Rejected",
    //       name: "Graphic Design Services",
    //       date: "May 15, 2023"
    //     },
    //     {
    //       id: "005",
    //       applicant: "Eva Green",
    //       status: "Pending",
    //       name: "Content Writing",
    //       date: "Jun 20, 2023"
    //     }
    //   ];
      function getStatusColor(status: string): string {
        switch (status) {
          case "pending":
            return "#FFD700"; // Yellow
          case "In Review":
            return "#87CEEB"; // Light blue
          case "approved":
            return "#32CD32"; // Green
          case "Rejected":
            return "#FF6347"; // Red
          default:
            return "#FFFFFF"; // White (default color)
        }
      }

    
      const openViewModal = (tend: Application) => {
        console.log("selected", tend);
        
        setSelected(tend);
        setViewModal(true);
      } 

      useEffect(() => {
       if(selected){
        tenders.map((tender) => {
          if(tender.id === selected.id){
            setSelected(tender);
           
          }}

        );
        }
      }
      ,[
        selected
      ]);

      /* isDelivered */
      useEffect(() => {
        if(selected?.isDelivered){
          setTenders(tenders.map((tender) => {
            if(tender.id === selected.id){
              return {
                ...tender,
                isDerivered: true
              }
            }
            return tender;
          }));
        }
      }
      ,[
        selected
      ]);

      const ApproveTender = (tend: Application) => {
       // call the server to approve the tender api/products/admin/tenders/approve
        setApproving(true);
       setSelected(tend);
        console.log("Approve", tend);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              applicationId: tend.id
            }
          )
        }
        fetch('/api/products/admin/tenders/approve', requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if(data.status === 200){
                setApproveMessage(data.message);
                setApproving(false);
              }
              if(data.status === 400){
                setApproveErrMessage(data.message);
                setApproving(false);
              }
            });

            //trigger a refetch
            setTenders(tenders.map((tender) => {
              if(tender.id === tend.id){
                return {
                  ...tender,
                  status: "approved"
                }
              }
              return tender;
            }));
            setTenderWithLocation(tenderWithLocation.map((tender) => {
              if(tender.id === tend.id){
                return {
                  ...tender,
                  status: "approved"
                }
              }
              return tender;
            }
            ));

      }

      const deleteTender = async (tend: Application) => {
        console.log("Delete", tend);
        setDeleting(true);
        setSelected(tend);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              applicationId: tend.id
            }
          )
        }
       await fetch('/api/products/admin/tenders/delete', requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if(data.status === 200){
                setDeleteMessage(data.message);
                setDeleting(false);
              }
              if(data.status === 400){
                setDeleteErrMessage(data.message);
                setDeleting(false);
              }
            });

            //trigger a refetch
            setTenders(tenders.filter((tender) => tender.id !== tend.id));
            setTenderWithLocation(tenderWithLocation.filter((tender) => tender.id !== tend.id));

      }
      const sendInstructionToApplicant = (tend: Application) => {
        setIsSending(true);
        setSelected(tend);
        //send instructions to the applicant via api/products/admin/tenders/instructions 
        console.log("Send instructions", tend);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              applicationId: tend.id,
              applicantId: tend.applicantId,
            }
          )
        }
        fetch('/api/products/admin/tenders/instructions', requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if(data.status === 200){
                setIsSent(true);
                setIsSending(false);
              }
            }).catch((error:any) => {
              console.error('Error:', error.message);
              setIsSending(false);
            }
            );

      }

      // const getTenderLocation = (longitude: string, latitude: string) => {
      //   console.log("Longitude", longitude);
      //   console.log("Latitude", latitude);
      //   setCordinates({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });

      //   return setCordinates;
        
      // }
      const getTenderLocation = (longitude: string, latitude: string) => {
        return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      };

      useEffect(() => {
        const updatedCoordinates = tenderWithLocation.map((tender) => ({
          latitude: parseFloat(tender.latitude),
          longitude: parseFloat(tender.longitude),
        }));
    
        setCoordinates(updatedCoordinates);
      }, [tenderWithLocation]);
    
      
      const showLocation=(tend:tenderLocs)=>{
        const { longitude, latitude } = tend;
        if (longitude && latitude) {
          router.push(`/shareMap/${longitude}/${latitude}`);
        } else {
          alert('invalid cordinates')
        }
        
      }
      const calculateDaysRemaining = (expiryDate: string) => {
        const today = new Date();
        const expirationDate = new Date(expiryDate);
        return differenceInDays(expirationDate, today);
      };
      const differenceInDays = (date1: Date, date2: Date) => {
        const diffInMs = Math.abs(date1.getTime() - date2.getTime());
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      };
     
      // const handleDateToExpireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   setFormData({
      //     ...formData,
      //     dateToExpire: e.target.value,
      //     expiryDate: calculateExpiryDate(new Date(formData.postDate))
      //   });
      // };
      
      
  return (
    <Layout>
       <div className="flex items-center  my-2 justify-start flex-row gap-x-3  ">
        <h1 className="sm:text-3xl text-sm font-bold">
          {
            new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"
          }
          ,</h1>
        <p className="sm:text-3xl text-sm text-gray-500 dark:text-gray-400">{username}</p>
      </div>
          <div  className="flex items-center justify-start flex-row gap-x-3">
         

          <span className="">
           Admin Dashboard
         </span>
        {/* go back */}
        
       </div>

      

    <section className="w-full py-7 md:py-9 xl:py-12 overflow-hidden">
   
 <Drawer>
  <DrawerTrigger className=" 
  text-white bg-black rounded-md px-3  flex flex-row justify-center items-center gap-x-1 py-2 text-sm font-medium leading-5 shadow-md 
  ">
    <span>Create tender</span>

    <PlusIcon className="h-5 w-5" />
  </DrawerTrigger>
  <DrawerContent className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full h-[95%]  overflow-hidden">
    <DrawerHeader>
      <DrawerTitle>
        Create a new tender
        <div 
         className="my-4"
        />
          {
          message && (
            <div className="bg-green-100 border border-green-400 text-green-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline"> {message}</span>
            </div>
          )
        }
        {
          errMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline"> {errMessage}</span>
            </div>
          )
        }
      </DrawerTitle>
      {/* close */}
      <DrawerClose className="absolute top-0 right-0 mt-4 mr-4">
        <Button variant="outline">Cancel tender</Button>
      </DrawerClose>
  
    </DrawerHeader>
    <DrawerDescription className="overflow-y-auto h-[calc(100%-4rem)] py-10">
      
      <form onSubmit={handleSubmit} className=" space-y-6 w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold">
              Fill in the details
            </h2>
            {/* admin id */}
          <Card className="p-4">
          <div className="mb-4">
              <Badge className="text-sm font-medium">Admin ID:</Badge> <span className="text-gray-500">{adminId}</span>
            
            </div>
            <div className="mb-4">
              <Badge className="text-sm font-medium">Post By:</Badge> <span className="text-gray-500">{postBy}</span>
             
          </div>
          <div className="mb-4">
            <Badge className="text-sm font-medium">Post Date:</Badge> <span className="text-gray-500">{formData.postDate}</span>
           
          </div>
          {/* <div className="mb-4">
            <Badge className="text-sm font-medium">Expiry Date:</Badge> <span className="text-gray-500">{formData.expiryDate}</span>
           
          </div> */}
           <div className="mb-4">
            <Badge className="text-sm font-medium">Public Link:</Badge> <span className="text-gray-500">{formData.PublicLink}</span>
            </div>
            <div className="mb-4">
            <Badge className="text-sm font-medium">OCID:</Badge> <span className="text-gray-500">{formData.OCID}</span>
            </div>
            <div className="mb-4">
            <Badge className="text-sm font-medium">Financial Year:</Badge> <span className="text-gray-500">{formData.FinancialYear}</span>
            </div>
            <div className="mb-4">
              <Badge className="text-sm font-medium">Days to Close:</Badge> <span className="text-gray-500">{getClosingTime().toString()}</span>
            </div>
          </Card>
          <div className="mb-4">

            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tender Name</Label>
            <Input type="text"
            placeholder="Enter the name of the tender"
             name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* add tender sub modules */}
          <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-4">Tender Sub-Modules</Label>
        {formData.subModules.map((subModule, index) => (
          <Input
          
            key={index}
            type="text"
            placeholder={`Enter sub-module ${index + 1}`}
            value={subModule}
            onChange= {(e) => {
              const newSubModules = formData.subModules.map((sub, i) => {
                if (index === i) {
                  return e.target.value;
                }
                return sub;
              });
              setFormData({
                ...formData,
                subModules: newSubModules,
              });
            }
          }
            className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm my-3"
          />
        ))}
        <a
          onClick={addSubModule}
          className="mt-2 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-300 cursor-pointer my-2"
        >
          Add Sub-Module
        </a>
      </div>
          <div className="mb-4">
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tender Description
            </Label>
            <Textarea
            placeholder="Enter a brief description of the tender."
             name="description" id="description" value={formData.description} onChange={handleInputChange} rows={5} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></Textarea>
          </div>
          <div className="mb-4">
            <Label htmlFor="OpeningVenue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opening Venue
            </Label>
            <Input type="text"
            placeholder="Enter the opening venue"
             name="OpeningVenue" id="OpeningVenue" value={formData.OpeningVenue} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="dateToExpire" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date to Expire
            </Label>
            <Input
  type="date"
  name="dateToExpire"
  id="dateToExpire"
  value={formData.expiryDate}
  // contentEditable={true}
  onChange={(e) => {
    console.log(e.target.value);
    setFormData({
      ...formData,
      expiryDate: e.target.value,
    });
  }}
  
  className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
/>

          </div>
         
          
          <div className="mb-4">
            <Label htmlFor="procurementMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Procurement Method
            </Label>
            <Input type="text"
            placeholder="Enter the procurement method"
             name="procurementMethod" id="procurementMethod" value={formData.procurementMethod} onChange={handleInputChange} className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          
          <div className="flex justify-center max-w-lg mx-auto">
            <Button
            disabled={processing}
             type="submit" className="inline-flex  w-full justify-self-center items-center justify-center
            ">
             {
                processing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : "Create Tender"
             }
            </Button>
          </div>
        </form>
      </DrawerDescription>
  </DrawerContent>
           </Drawer>
        {
          !fetching && tenders.length > 0 && (
            <div className="text-center mt-8">
            <h2 className="text-3xl font-bold mb-6">Generate Report</h2>
            <PDFReport data={tenders} />
          </div>
          )
        }
      <div className="container px-4 md:px-6 max-w-5xl">
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-1 lg:gap-12">
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold">Applied Tenders</h3>
              <div className="overflow-x-auto">
              {
           dataErrMsg && (
            <div className="bg-red-100 border
             
             border-red-400 text-red-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline"> {dataErrMsg}</span>
            </div>
          )
        }

{
            fetching && (
              <div className="bg-blue-100 border animate-pulse flex flex-row justify-center items-center border-blue-400 text-blue-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Fetching data... </strong>
                <span className="block sm:inline"> 
                <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              </div>
            )
          }
 {
  !fetching && !dataErrMsg && (
    <Table className="min-w-full overflow-x-auto">
    <TableHeader>
      <TableRow>
        <TableHead>Tender ID</TableHead>
        <TableHead>Applicant</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Tender Name</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Bank Statement</TableHead>
        <TableHead>Proposal</TableHead>
        <TableHead>Delivery</TableHead>
        <TableHead>Actions
          (Approve, Delete, View)
        </TableHead>

        
      </TableRow>
    </TableHeader>
    <TableBody>

      {

        tenders.length === 0 && (
        <TableRow>
            <TableCell  colSpan={8} className="text-center">
              <div className="flex flex-col items-center justify-center">
                <Inbox className="h-12 w-12 text-gray-400" />
                <span className="text-gray-400">No tenders found</span>
              </div>
            </TableCell>
          </TableRow>
         
        )
        
      }
      {tenders.map((tender) => (
        <TableRow
        style={{
          borderRadius: "10px",
          border: tender.status === "approved" ? "1px dashed #10B981 " 
          : tender.status === "pending" ? "1px dashed #F59E0B" : "2px solid #EF4444"
        }}
         key={tender.id}>
          <TableCell>{tender.id}</TableCell>
          <TableCell>{tender.applicant.username.split("@")[0]}</TableCell>
          <TableCell style={{ backgroundColor: getStatusColor(tender.status) }}>{tender.status}</TableCell>
          <TableCell>{tender.tender.name}</TableCell>
          <TableCell>{formatDate(tender.date)}</TableCell>
          {/* <TableCell>
          {
            isSending && selected?.id === tender.id ? (
              <button 
              disabled={isSending}
              style={{
                cursor: "not-allowed"
               }}
              className="text-blue-600  items-center gap-x-1 flex-row hover:underline mx-1 flex justify-center">
              <span>Sending...</span>
              <Loader className=" h-4 w-4 animate-spin" />
            </button>
            ) : (
              <a
              onClick={() => sendInstructionToApplicant(tender)}
             className="flex  cursor-pointer justify-center items-center gap-x-1 flex-row hover:underline mx-1">
               <span className="text-blue-600 hover:underline">
                 Track
               </span>
               <Activity className="h-5 w-5
               text-blue-600 hover:underline
               " />
             </a>
            )
          }
          </TableCell> */}
            {/* bankStamentUrlAttachment */}
            <TableCell>
          {
            tender.bankStamentUrlAttachment ? (
              <a 
              onClick={()=>handlePDFView(tender.bankStamentUrlAttachment)}
               className="text-blue-600 cursor-pointer hover:underline flex justify-center items-center  gap-x-1" >
                <span>View</span>
                <Eye className=" h-4 w-4" />
               </a>
            ) : (
              <span className="text-red-600">No attachment</span>
            )
          }
          </TableCell>
          <TableCell>
          {
            tender.proposal ? (
              <a 
              onClick={()=>handleProposalPDFView(tender.proposal)}
               className="text-blue-600 cursor-pointer hover:underline flex justify-center items-center  gap-x-1" >
                <span>View</span>
                <Eye className=" h-4 w-4" />
               </a>
            ) : (
              <span className="text-red-600">No attachment</span>
            )
          }
          </TableCell>
          <TableCell>
          {
            tender.isDelivered ? (
              <span className="text-green-600">Delivered</span>
            ) : (
              <span className="text-red-600">Not Delivered</span>
            )
          }
          </TableCell>
          <TableCell>
              <div  className=" flex justify-center items-center gap-x-2 flex-row">
    {/* <button className="text-blue-600  items-center gap-x-1 flex-row hover:underline mx-1 flex justify-center">
              <span>Edit</span>
              <Edit className=" h-4 w-4" />
            </button> */}
           {
            approving && selected?.id === tender.id ? (
              <button 
              disabled={approving}
              style={{
                cursor: "not-allowed"
               }}
              className="text-green-600 flex justify-center items-center gap-x-1 flex-row hover:underline mx-1">
              <span>Approving...</span>
              <Loader className=" h-4 w-4 animate-spin" />
            </button>
            ) : (
              <button
            onClick={() => ApproveTender(tender)}
             className="text-green-600 flex justify-center items-center gap-x-1 flex-row hover:underline mx-1">
            <span>Approve</span>
              <CheckCircle className=" h-4 w-4" />
            </button>
            )
           }
            {
              deleting && selected?.id === tender.id ? (
                <button
                disabled={deleting}
                style={{
                  cursor: "not-allowed"
                 }}
                 className="text-red-600 flex justify-center items-center gap-x-1 flex-row hover:underline mx-1">
              <span>Deleting...</span>
              <Loader className=" h-4 w-4 animate-spin" />
            </button>
              ) : (
                <button
                onClick={() => deleteTender(tender)}
                 className="text-red-600 flex justify-center items-center gap-x-1 flex-row hover:underline mx-1">
              <span>Delete</span>
              <Trash className=" h-4 w-4" />
            </button>
              )
            }
            {/* view */}
            <button
            onClick={() => openViewModal(tender)}
             className="text-gray-600 flex justify-center items-center gap-x-1 flex-row hover:underline mx-1">
            <span>View</span>
            <Eye className=" h-4 w-4" />
            </button>
              </div>
          
           
          </TableCell>
        
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )
 }

{
       
        openPDF && (
          <Card className="fixed inset-x-0  bottom-0 top-0 z-50
          backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
        
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Bank Statement</h2>
                <button onClick={() => setOpenPDF(false)} className="text-red-600">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">
                <form action={pdfUrl} method="get" target="_blank">
                  <Button type="submit" className="w-full">
                    View Statement
                  </Button>
                </form>
              </div>
            </div>
         </Card>
        
        )
       }
       {
       
       openProposalPDF && (
         <Card className="fixed inset-x-0  bottom-0 top-0 z-50
         backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
       
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-lg">
             <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold">
                Proposal
               </h2>
               <button onClick={() => setOpenProposalPDF(false)} className="text-red-600">
                 <XIcon className="h-5 w-5" />
               </button>
             </div>
             <div className="mt-4">
               <form action={proposalPdfUrl} method="get" target="_blank">
                 <Button type="submit" className={
                  `w-full`
                 }>
                   View Proposal
                 </Button>
               </form>
             </div>
           </div>
        </Card>
       
       )
      }
 {
  viewModal && (
    <div className="relative 
    overflow-hidden
    bg-white dark:bg-gray-800
    max-h-[500px] 

"
    >

 <Card className="fixed  inset-0 overflow-y-auto   z-50
my-auto 
h-[calc(100%-1rem)] 
max-w-7xl
m-auto
bg-transparent 
 flex items-center justify-center
 pb-9
  transition-all duration-500 ease-in-out pt-72">

         
        
         <div className="flex items-end justify-center pt-4 px-4  text-center sm:p-0  overflow-y-auto py-9">
      <div className=" fixed z-50 rounded-lg  right-0 justify-end" aria-hidden="true"></div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      {/* Modal Content */}
      <div className="" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="bg-white flex w-full justify-center items-center m-auto dark:bg-gray-800 rounded-lg text-left shadow-xl transform transition-all ">
            <button onClick={() => setViewModal(false)} className="absolute top-0 right-0 mt-4 mr-4">
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6 text-black" />
            </button>

            <div className=" rounded-lg w-full flex justify-center items-center m-auto overflow-y-auto dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
              <div className=" w-full">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-300" id="modal-headline">
                    Tender Application
                  </h3>
                  {/* ... (Additional information about the tender) */}
                  <div className="mt-2">
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      NID: {selected?.NID}
                    </p>
                    {/* Add more information as needed */}
                  </div>
                  

                  <Card className="mt-4  p-2 shadow-lg">
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Badge className="text-sm font-medium m-2">Proposal</Badge>
                    </Label>
                    <CardContent>
                      <div className="flex justify-center items-center gap-x-3">
                        <span className="text-sm font-medium">Proposal</span>
                        <a
                        href={selected?.proposal}
                        className="bg-green-500 text-white
                        p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 cursor-pointer"

                        
                        target="_blank"
                        >
                          View Proposal
                        </a>
                      </div>

                    </CardContent>
                   
                  </Card>
                  {/* remaining days and post days */}
                  <Card className="mt-4  p-2 shadow-lg">
                    <CardContent className={`text-sm py-3 font-medium text-gray-700 dark:text-gray-300  flex justify-center items-center ${calculateDaysRemaining(selected?.date ?? '') < 0 ? "text-red-600" : "text-green-600"}`}>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-sm font-medium m-2">Remaining Days</span>
                    </Label>
                     <span className=" bg-gray-200 p-3 rounded-full"> 
                     {/* compute the difference btn expiry and post date */}
                     {
                        calculateDaysRemaining(selected?.tender.expiryDate ?? '') < 0 ? "Expired" : `${calculateDaysRemaining(selected?.tender.expiryDate ?? '')}
                      
                     

                      `}
                     
                      days 
                      to close
                      </span>
                    </CardContent>
                    
                  </Card>
                  {/* fetch subModules */}
                  <Card className="mt-4  shadow-lg flex flex-col justify-start items-start p-4">
                    <CardContent className={`text-sm py-3  flex-col font-medium text-gray-700 dark:text-gray-300  flex justify-start items-start`}>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-sm font-medium m-2">Sub Modules Selected by Applicant</span>
                    </Label>
                     <div className="flex flex-row justify-center items-center gap-x-3">
                     {
                        selected?.subModules.map((sub, index) => (
                          <span
                           key={index} className={`
                           bg-gray-200 p-5 rounded-full m-1 flex justify-center gap-x-2 flex-row items-center ${selected?.isDelivered ? "bg-green-500" : "bg-gray-200"}
                           `}>
                            <span className="text-sm font-medium">{sub}</span>
                            {
                              selected?.isDelivered && (
                                <CheckCircle className="h-5 w-5 text-white" />
                              )
                            }
                           </span>
                        ))
                      }
                   
                     </div>
                     <div className="mt-4 flex gap-x-3 justify-center items-center mx-2 ">
                       <span>
                        Expiry Date: {formatDate(selected?.tender.expiryDate ?? '')}
                       </span>
                       <span>
                        Post Date: {formatDate(selected?.date ?? '')}
                       </span>
                      </div>
                    </CardContent>
                    <div className="mt-4 flex justify-center items-center w-full mx-auto gap-x-4">
                    {
                         selected &&  !selected?.isDelivered && (
                          <Button
                          disabled={updateDelivery}
                            onClick={() => updateDeriveredStatus(selected)}
                            className="bg-green-500 text-white
                            
                            "
                          >
                            {
                              updateDelivery ? "Updating..." : "Update Delivery"
                            }
                          </Button>
                        )
                      }
                      {
                        selected?.isDelivered && (
                          <Button className="bg-green-500 text-white">
                            Tender is derivered
                          </Button>
                        )

                      }
                    {/* toggle input if derivered */}
                    <div className="mt-4 flex justify-center gap-x-3 p-4 items-center">
                      

                      <Switch
                        checked={selected?.isDelivered}
                         style={{
                          backgroundColor: selected?.isDelivered ? "green" : "red"
                         }}
                        onChange={() => {
                          if (selected) {
                            updateDeriveredStatus(selected);
                          }
                        }}
                        className={`${
                          selected?.isDelivered ? 'bg-green-500 text-green-500' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`${
                            selected?.isDelivered ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    {
                      updateDelivery && (
                        <Loader className="h-5 w-5 animate-spin" />
                      )
                    }
                    {
                      selected?.isDelivered && (
                        <span className="text-green-500">Tender is derivered</span>
                      )
                    }
                   
                      </div>
                  </div>
                  </Card>
                  {/* hint about deirvery of tender */}
                 
                  {/* Placeholder for additional content */}
                  <div className="mt-4">
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    When the tender is derivered,The toggle will be enabled
                    {
                      selected?.isDelivered
                    }
                  </p>
                    <div className="mt-4 flex gap-x-4">
                      <Badge className="text-sm font-medium">Delivered:</Badge> <span className="text-gray-500">{selected?.isDelivered ? "Yes" : "No"}</span>
                   
                      <Badge className="text-sm font-medium">Tender ID:</Badge> <span className="text-gray-500">{selected?.id}</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
         </Card>
         </div>
   

  )

 }

              </div>
            </div>
          </div>
        </div>
      </div>
      {
        isSent && (
          <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-green-100 border my-2 border-green-400 text-green-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">
              <span className="block sm:inline">Instructions sent to</span>
              {` `}
              <span className="block sm:inline"> {selected?.applicant.username.split("@")[0]} </span>
            </span>
           
              <span className="block sm:inline"> 
                Recieved the instructions, The applicant will allow you to track the tender.
               
              </span>
           
          </div>
        </div>
        )
      }
      {
        approveErrMessage && (
          <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-red-100 border my-2 border-red-400 text-red-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline"> {approveErrMessage}</span>
          </div>
        </div>
        )
      }
      {
        approveMessage && (
          <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-green-100 border my-2 border-green-400 text-green-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline"> {approveMessage}</span>
          </div>
        </div>
        )
      }
      {
        deleteMessage && (
          <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-green-100 border my-2 border-green-400 text-green-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline"> {deleteMessage}</span>
          </div>
        </div>
        )

      }
      {
        deleteErrMessage && (
          <div className="fixed inset-x-0  bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-red-100 border my-2 border-red-400 text-red-700 sm:text-lg text-sm px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline"> {deleteErrMessage}</span>
          </div>
        </div>
        )
      }

    
    </section>
{/* section of card based on tenders */}
{/* <h4 className="text-lg text-center font-bold">Tender Applications</h4>
<i className=" flex justify-center items-center mx-auto my-2 max-w-md">click each card  to see current location of the tender</i> */}
  {/* <Card className="p-4 my-4 bg-gray-50 shadow-sm dark:bg-gray-700 
  flex flex-row flex-1 flex-wrap
  m-auto

  "> */}
    
    {/* {
      tenderWithLocation.map((tender, index) => (
        <>
        
        <Card className=" my-4 bg-gray-100 dark:bg-gray-700
        min-w-[200px] max-w-[340px] rounded-md shadow-sm
        hover:shadow-2xl transition-all duration-300 ease-in-out
        flex flex-row mx-auto
        " key={index} style={{
          borderRadius: "10px",
          cursor: "pointer",
          
          border: tender.status === "approved" ? "2px solid #10B981;" 
          : tender.status === "pending" ? "2px solid #F59E0B" : "2px solid #EF4444"
        }}
        
         onClick={() => showLocation(tender)}>
        
         
         <div className="flex flex-row justify-between gap-x-3 text-sm">
         <span
         className=" bg-green-600 py-3 flex-col text-white gap-y-3  flex justify-center items-center px-2 rounded object-cover"
         >
          <span>{tender.id.slice(0,15).concat("...")}</span>
          
          <Badge>{tender.tender.name}</Badge>
          </span>
          <i className="p-3 flex justify-center items-center  flex-col  gap-y-2">
          <span className=" text-sm flex justify-end items-center flex-col">
            <span>Latitude: {coordinates[index]?.latitude || 'Untracked'}</span>
            <span>Longitude: {coordinates[index]?.longitude || 'Untracked'}</span>
            
           </span>
           <Badge>{location}</Badge>
          </i>
         </div>
        </Card>
        </>
        
      ))

    } */}

  {/* </Card> */}
{/* <Card className="p-4 my-4 bg-gray-100 dark:bg-gray-700">
  <Map product={selected?.tender.name} onCoordinatesChange={handleCordinatesChange} />
</Card> */}
    </Layout>
  )
}

