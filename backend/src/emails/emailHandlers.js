import { createWelcomeEmailTemplate } from "./emailTemplates.js"
import { resendClient, sender } from "../lib/resend.js"


export const sendWelcomeEmail = async (name,email,clientURL) => {
 try {
     const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject:"Welcome to QuickChat",
        html: createWelcomeEmailTemplate(name,clientURL)

     })

     if(error){ 
      console.error("Error sending welcome email:", error)
     }
      console.log("Welcome email send successfully", data)

 } catch (error) {
    
    throw new Error("Failed to send welcome email")
 }
}