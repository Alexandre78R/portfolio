import { Message } from "../../Message";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const WhoamiEducation: React.FC = (): React.ReactElement => {

  const dataEducations = useSelector((state: RootState) => state.educations.dataEducations);
    
  return (
      <Message>
        {
          dataEducations?.slice().reverse().map(education => {
            return(
              <div key={education.id} className="m-2">              
                <div className="flex flex-row items-center">
                  <span className=" mr-3 text-primary">{education.year}</span>
                  <p>{education.title}</p>
                </div>
                <div className="flex flex-row items-center">
                  <p className="ml-14 text-text300" >{education.school}</p>
                  <p className="ml-1 text-text300" >- {education.location}</p>
                </div>
              </div>
            )
          })
        }
      </Message>
    );
};

export default WhoamiEducation;