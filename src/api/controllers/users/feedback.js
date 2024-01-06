const User = require("../../models/user.model")
const Feedback = require("../../models/feedback.model")

const publishFeedback = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })
        const { feedback } = req.body
        const newFeedback = await Feedback({
        feedback: feedback,
        user_id: user._id,
        })

        const savedFeedback = await newFeedback.save()
        res.status(201).json({
        message: savedFeedback,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred' })
    }
    }

module.exports = { publishFeedback }