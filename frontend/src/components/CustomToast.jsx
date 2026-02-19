import {Toaster} from "react-hot-toast"

const CustomToast = () => {
  return (
 <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#27272a",
          color: "#e4e4e7",
          border: "1px solid rgba(82, 82, 91, 0.85)",
        },
        success: {
          style: {
            border: "1px solid rgba(16, 185, 129, 0.5)",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ecfdf5",
          },
        },
        error: {
          style: {
            border: "1px solid rgba(244, 63, 94, 0.5)",
          },
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#fff1f2",
          },
        },
      }}
    />
  )
}

export default CustomToast