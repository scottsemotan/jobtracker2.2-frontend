import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { auth } from "../../firebase";
import axios from "axios"
// import { useAuth } from "../../Context/AuthContext"
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import "./JobForm.css";



function JobForm() {
    // const { currentUser } = useAuth()

    const [jobs, setJobs] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
            
            const results = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
                {
                    headers: {
                        "Authorization": `Bearer ${idToken}`
                    }
                })
            console.log(results.data)
            setJobs(results.data)
        }
        fetchData()
    }, [])

    //function to toggle employer response
    const employerResponse = async (id) => {

        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
        const eResponse = await axios(`https://jobtracker2-2.herokuapp.com/employer-response/${id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

        const getResults = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
            {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
        //console.log(results.data)
        setJobs(getResults.data)
    }

    //function to toggle rejected
    const rejected = async (id) => {

        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
        const eResponse = await axios(`https://jobtracker2-2.herokuapp.com/rejected/${id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

        const getResults = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
            {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
        //console.log(results.data)
        setJobs(getResults.data)
    }

    //function to toggle interview_scheduled
    const interviewScheduled = async (id) => {

        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
        const eResponse = await axios(`https://jobtracker2-2.herokuapp.com/interview/${id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

        const getResults = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
            {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
        //console.log(results.data)
        setJobs(getResults.data)

    }
    //Function to delete card from UI

    const deleteJob = async (id) => {

        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
        const deleteResults = await axios(`https://jobtracker2-2.herokuapp.com/delete-job/${id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

        const getResults = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
            {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
        //console.log(results.data)
        setJobs(getResults.data)
    }


    //function to add job to database and render to UI
    const handleSubmit = async (e) => {
        e.preventDefault();

        let postJob = {
            company_name: e.target.company.value,
            job_title: e.target.jobtitle.value,
            date_applied: e.target.date.value,
            city: e.target.city.value,
        }


        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
        const addJobs = await axios('https://jobtracker2-2.herokuapp.com/job-apps',

            {
                data: JSON.stringify(postJob),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${idToken}`
                }
            })

        //setting state for submit

        const sendJob = await axios('https://jobtracker2-2.herokuapp.com/job-apps',
            {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            })
        setJobs(sendJob.data)
        console.log(sendJob.data)
    }

    function handleChange(event) {
    };



    //function for timer on cards
    function replyTimer(dateApplied, cardId) {

        // Set the date we're counting down to
        var countDownDate = new Date(dateApplied).getTime() + 691200000;

        var x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            //  Time calculations for days
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));

            // render how many days left till follow up. If after 7 days since application it will render "Time to follow up with this job!"
            if (distance < 86400000) {
                clearInterval(x);
                document.getElementById(cardId).innerHTML = "Time to follow up with this job!";
            } else {
                clearInterval(x);
                document.getElementById(cardId).innerHTML = "Follow up in " + days + " day(s).";
            }
        });
    }







    return ["Light"].map((variant, idx) => (


        <Row>
            {/* <Row className="jobForm-Row"> */}
            <Col className="col-cards col-8">
                <Row>
                    {
                        jobs.sort((a, b) => a.id < b.id ? 1 : -1).map((job) => {
                            if (job.is_deleted !== true && job.company_responded !== true)

                                return (
                                    <Col onLoad={replyTimer(job.date_applied, job.id)}>
                                        <Card className="col-2"
                                            bg={variant.toLowerCase()}
                                            key={idx}
                                            text={variant.toLowerCase() === "light" ? "dark" : "white"}
                                            style={{ width: "16rem" }}
                                            className="mb-2"
                                        >
                                            <Card.Body className="card-regular">
                                                <Card.Header>Job Application #{job.id} </Card.Header>
                                                <br></br>
                                                <Card.Title>{job.job_title}</Card.Title>
                                                <Card.Text>
                                                    {job.company_name}
                                                    <br></br>
                                                    {job.city}
                                                    <br></br>
                                                    {job.date_applied}
                                                    <br></br>
                                                    <p id={job.id}></p>
                                                </Card.Text>
                                                <DropdownButton id="dropdown-item-button" title="Options">
                                                    <Dropdown.Item as="button" onClick={() => { employerResponse(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Response?</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { rejected(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Rejected</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { interviewScheduled(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Interview Scheduled</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { deleteJob(job.id) }}>Delete</Dropdown.Item>

                                                </DropdownButton>
                                                <br></br>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )

                            //renders card with "Company responded!" and turns it a color when company responded is true 
                            if (job.is_deleted !== true && job.company_responded !== false)
                                return (
                                    <Col >
                                        <Card className="col-2"
                                            bg={variant.toLowerCase()}
                                            key={idx}
                                            text={variant.toLowerCase() === "light" ? "dark" : "white"}
                                            style={{ width: "16rem" }}
                                            className="mb-2"
                                        >
                                            <Card.Body className="card-response" style={{ backgroundColor: "rgba(71,229,188, 0.50)" }}>
                                                <Card.Header>Job Application #{job.id} </Card.Header>
                                                <br></br>
                                                <Card.Title>{job.job_title}</Card.Title>
                                                <Card.Text>
                                                    {job.company_name}
                                                    <br></br>
                                                    {job.city}
                                                    <br></br>
                                                    {job.date_applied}
                                                    <br></br>
                                                    <p className="response">Company Responded!</p>
                                                </Card.Text>
                                                <DropdownButton id="dropdown-item-button" title="Options">
                                                    <Dropdown.Item as="button" onClick={() => { employerResponse(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Response?</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { rejected(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Rejected</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { interviewScheduled(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Interview Scheduled</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { deleteJob(job.id) }}>Delete</Dropdown.Item>

                                                </DropdownButton>
                                                <br></br>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            
                            //renders card with "Rejected!" and turns it a color when rejected is true 
                            if (job.is_deleted !== true && job.rejected !== false)
                                return (
                                    <Col >
                                        <Card className="col-2"
                                            bg={variant.toLowerCase()}
                                            key={idx}
                                            text={variant.toLowerCase() === "light" ? "dark" : "white"}
                                            style={{ width: "16rem" }}
                                            className="mb-2"
                                        >
                                            <Card.Body className="card-rejected" style={{ backgroundColor: "rgba(209, 61, 61, 0.5)" }}>
                                                <Card.Header>Job Application #{job.id} </Card.Header>
                                                <br></br>
                                                <Card.Title>{job.job_title}</Card.Title>
                                                <Card.Text>
                                                    {job.company_name}
                                                    <br></br>
                                                    {job.city}
                                                    <br></br>
                                                    {job.date_applied}
                                                    <br></br>
                                                    <p className="response">Rejected!</p>
                                                </Card.Text>
                                                <DropdownButton id="dropdown-item-button" title="Options">
                                                    <Dropdown.Item as="button" onClick={() => { employerResponse(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Response?</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { rejected(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Rejected</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { interviewScheduled(job.id) }} data-toggle="button" aria-pressed="false" autoComplete="off">Interview Scheduled</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => { deleteJob(job.id) }}>Delete</Dropdown.Item>

                                                </DropdownButton>
                                                <br></br>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )





                        })
                    }
                </Row>
            </Col>

            <Col className="col-4">
                <Form className="m-3" onSubmit={handleSubmit}>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>
                            Company Name
                            </Form.Label>
                        <Col sm={10}>
                            <Form.Control onChange={handleChange} type="text" placeholder="Company Name" id="company" required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>
                            Job Title
                            </Form.Label>
                        <Col sm={10}>
                            <Form.Control onChange={handleChange} type="text" placeholder="Job Title" id="jobtitle" required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Date Applied
                            </Form.Label>
                        <Col sm={10}>
                            <Form.Control onChange={handleChange} type="date" placeholder="xxxx-xx-xx" id="date" required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>
                            City
                            </Form.Label>
                        <Col sm={10}>
                            <Form.Control onChange={handleChange} type="text" placeholder="City" id="city" required />
                        </Col>
                    </Form.Group>


                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit" >Add Job</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Col>



            {/* </Row>       */}
        </Row>
    ))

}


export default JobForm;