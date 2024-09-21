const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;

    try {
        // check if subsection is valid or not
        const subSection = await SubSection.findById(subSectionId);
        
        if(!subSection){
            return res.status(400).json({
                error: "Invalid subsection"
            })
        }

        // check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId : userId
        });

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course progress does'nt exist"
            })
        }
        else{
            // check for re-completing video/sub-section
            if(courseProgress.completedVideos.includes(subSection)){
                return res.status(400).json({
                    error:"Subsection already completed"
                })
            }

            // push completeed lectures into db
            courseProgress.completedVideos.push(subSectionId)
        }
        await courseProgress.save();
    } catch (error) {   
        console.error(error);
        return res.status(500).json({
            error:"Internal server error"
        })
    }
}