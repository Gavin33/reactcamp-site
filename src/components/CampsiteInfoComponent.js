import React, { Component } from 'react';
// import { RenderDirectoryItem } from './DirectoryComponent';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
import { baseUrl } from '../shared/baseUrl';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


class CommentForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }
    handleLogin(values) {
        console.log("Current state is: " + JSON.stringify(values));
        alert("Current state is: " + JSON.stringify(values));
        this.toggleModal();
        values.preventDefault();
    }
    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleModal}><i className="fa fa-pencil fa-lg" aria-hidden="true" />Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <LocalForm className="ml-3 mr-3" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select
                                model=".rating" name="rating"
                                className="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                        </div>

                        <div className="form-group">
                            <Label htmlFor="author">Author</Label>
                            <Control.textarea model=".author"
                                id="author" name="author"
                                className="form-control"
                                validators={{
                                    minLength: minLength(2),
                                    maxLength: maxLength(15),
                                }} />
                            <Errors
                                className="text-danger"
                                model=".author"
                                show="touched"
                                component="div"
                                messages={{
                                    minLength: "Must be at least 2 characters",
                                    maxLength: "Must be 15 characters or less",
                                }} />
                        </div>

                        <div className="form-group">
                            <Label htmlFor="text">Text</Label>
                            <Control.textarea model=".text" id="text" name="text"
                                className="form-control"
                                rows="6" />
                        </div>
                        <div className="form-group">
                            <Button type="submit" value="submit" color="primary">
                                Submit
                            </Button>
                        </div>
                    </LocalForm>
                </Modal>
            </React.Fragment>
        )
    };
}

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    )
}
function RenderComments({ comments, postComment, campsiteId }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />

            </div>
        )
    }
}
function CampsiteInfo(props) {
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return <div />;
}

export default CampsiteInfo;