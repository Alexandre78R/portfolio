import { useLang } from "@/context/Lang/LangContext";
import { TextField, Typography } from "@mui/material";
import ButtonCustom from "../Button/Button";

const Contact: React.FC = (): React.ReactElement => {
    
    const { translations } = useLang();

    const handleClick: () => void = (): void => {
        console.log("coucou")
    };

    return (
        <div className="flex flex-col items-center">
        <div className="bg-body p-8 shadow-lg mt-8 text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
          <Typography variant="h3" component="h3" className="text-2xl font-bold text-text mb-6">
            Contact
          </Typography>
  
          <form className="space-y-6 bg-body">
            {/* First Name */}
            <TextField
              id="firstname"
              label="First Name"
              variant="outlined"
              fullWidth
              required
              className="bg-white border border-gray-300 rounded-md text-text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-color)",
                    borderWidth: "0.2rem",
                  },
                  "& .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
              }}
            />
  
            {/* Last Name */}
            <TextField
              id="lastname"
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              className="bg-white border border-gray-300 rounded-md text-text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-color)",
                    borderWidth: "0.2rem",
                  },
                  "& .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
              }}
            />
  
            {/* Email */}
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              required
              className="bg-white border border-gray-300 rounded-md text-text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-color)",
                    borderWidth: "0.2rem",
                  },
                  "& .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
              }}
            />
  
            {/* Object */}
            <TextField
              id="object"
              label="Object"
              variant="outlined"
              fullWidth
              required
              className="bg-white border border-gray-300 rounded-md text-text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-color)",
                    borderWidth: "0.2rem",
                  },
                  "& .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
              }}
            />
  
            {/* Message */}
            <TextField
              id="message"
              label="Message"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              required
              className="bg-white border border-gray-300 rounded-md text-text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-color)",
                    borderWidth: "0.2rem",
                  },
                  "& .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiFormLabel-root": {
                    color: "var(--primary-color)",
                    fontStyle :"bold",
                    backgroundColor :"white"
                  },
              }}
            />
  
            <ButtonCustom
              onClick={handleClick}
              text="envoyer"
            />
          </form>
        </div>
      </div>
    );
};

export default Contact;