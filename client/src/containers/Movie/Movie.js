import React, { Component } from 'react';
import "./movie.css";
import { NavBar } from "./../../components/NavBar";
import { Footer } from "./../../components/Footer";
import { Navbar, NavbarBrand, NavbarNav, NavItem, NavbarToggler, Collapse } from 'mdbreact';
import { Button, Card, CardBody, CardTitle, CardText } from 'mdbreact';
import { Form, Text, TextArea } from 'informed';
import LocationPicker from 'react-location-picker';
import Rating from 'react-rating';
import { Comment } from './Comment';
import API from './../../services/apis';
import { Server } from './../../configs/server';

export default class Movie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie_id: this.props.match.params.movie_id,
            movie: {},
            comments: [],
            collapseID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            cines: [],
            position: {
                lat: 21.04192103737484,
                lng: 105.81603412628169
            },
            address: "",
            hinting: false,
            hints: []
        }
    }

    validateRequired = (value) => {
        return (!value) ? 'This field is required' : null;
    }

    // toggleCollapse = key => () => {
    //     this.setState(prev = ({
    //         [key]: !prev[key]
    //     }))
    // }

    onSubmitComment = (vals) => {
        API.postComment(this.state.movie_id, vals.name, vals.email, vals.comment, vals.point || 3)
            .then(res => {
                this.fetchComments();
            })
            .catch(err => console.log(err))
    }

    changeLocation = ({ position, address }) => {
        console.log(position, address);
        this.setState({ position, address })
    }

    hintShowtime = () => {
        this.setState({ hinting: true });
        API.postHintShowtime(this.state.movie_id, this.state.position)
            .then(res => {
                console.log(res);
                this.setState({
                    hinting: true,
                    hints: res
                })
            })
            .catch(err => console.log(err))
    }

    renderCines = () => {
        if (!this.state.cines) return null;
        return this.state.cines.map((cine, index) => (
            <NavBar className="movie-cine" color="cyan lighten-5" light>
                <NavbarBrand>{cine.cine_name}</NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("hide" + cine.cine_group_id)} />
                <Collapse id={"hide" + cine.cine_group_id} isOpen={this.state["hide" + cine.cine_group_id]} navbar>
                    <NavbarNav left>
                        <NavItem>
                            {this.renderCine(cine.list_crawl_group)}
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </NavBar>
        ))
    }

    renderCine = (cineGroup) => {
        return cineGroup.map((cine) => (
            <Navbar className="movie-cine-child" color="grey lighten-5" light>
                <NavbarBrand>{cine.cine_name}</NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("hide" + cine.cine_id)} />
                <Collapse id={"hide" + cine.cine_id} isOpen={this.state["hide" + cine.cine_id]} navbar>
                    <NavbarNav left>
                        <NavItem className="showtime-container">
                            {this.renderShowtime(cine.showtime)}
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        ))
    }

    renderShowtime = (showtimes) => {
        const time = new Date().toTimeString().split(' ')[0];
        return showtimes.map((showtime) => (
            <a href="https://www.cgv.vn"
                className={"movie-showtime" + (time < showtime ? "" : " ended")}>
                {showtime}
            </a>
        ))
    }

    renderComments = () => {
        return this.state.comments.map((comment) => (
            <Comment comment={comment} />
        ))
    }

    renderHint = () => {
        return this.state.hints.map((cine) => (
            <div className="movie-hint">
                <span>{cine.name}</span>
                {
                    cine.showtime.map((time) => (
                        <a href="https://www.cgv.vn/"
                            className="movie-showtime">
                            {time}
                        </a>
                    ))
                }
            </div>
        ))
    }

    fetchMovieById = () => {
        API.getMovieById(this.state.movie_id)
            .then((res) => {
                this.setState({ movie: res })
            })
            .catch(err => console.log(err))
    }

    fetchMovieShowtime = () => {
        API.getMovieShowtime(this.state.movie_id)
            .then((res) => {
                this.setState({ cines: res })
            })
            .catch(err => console.log(err))
    }

    fetchComments = () => {
        API.getComments(this.state.movie_id)
            .then((res) => {
                this.setState({ comments: res })
            })
            .catch(err => console.log(err))
    }

    componentDidMount = () => {
        this.fetchMovieById();
        this.fetchMovieShowtime();
        this.fetchComments();
    }

    render() {
        return (
            <div className="movie">
                <NavBar />
                <div className="movie-header">
                    <div className="movie-header-inner">
                        <div className="movie-img">
                            <img alt="" src={Server + this.state.movie.image_url} />
                        </div>
                        <div className="movie-info">
                            <h2 className="movie-name">{this.state.movie.name}</h2>
                            <h5 className="movie-type">{this.state.movie.types}</h5>
                            <div className="movie-props">
                                <div className="movie-prop star">{this.state.movie.gmdb_rating || "?"}
                                    <div>rating</div>
                                </div>
                                <div className="movie-prop imdb">{this.state.movie.imdb_rating || "?"}
                                    <div>iMDb</div>
                                </div>
                                <div className="movie-prop limit">{this.state.movie.age_rated || "?"}
                                    <div>limit</div>
                                </div>
                                <div className="movie-prop duration">{this.state.movie.duration || "?"}
                                    <div>mins</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="movie-ctn">
                    <div className="row info">
                        <Card className="movie-card">
                            <CardBody>
                                <CardTitle>Thông tin</CardTitle>
                                <hr />

                                <h5>🎥 Trailer</h5>
                                <iframe title="trailer"
                                    className="trailer-iframe"
                                    src={this.state.movie.trailer_url}
                                    frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>

                                <h5>🎥 Giới thiệu</h5>
                                <CardText>
                                    {this.state.movie.description}
                                </CardText>

                                <h5>🎥 Thể loại</h5>
                                <CardText>
                                    {this.state.movie.types}
                                </CardText>

                                <h5>🎥 Diễn viên</h5>
                                <CardText>
                                    {this.state.movie.main_actors}
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card className="movie-card">
                            <CardBody>
                                <CardTitle>Lịch chiếu</CardTitle>
                                <hr />
                                {this.renderCine()}
                                <hr />
                                <h5>Chọn địa điểm tìm kiếm suất chiếu &lt;3</h5>
                                <LocationPicker
                                    containerElement={<div style={{ height: '100%' }} />}
                                    mapElement={<div style={{ height: '500px' }} />}
                                    defaultPosition={{
                                        lat: 21.04192103737484,
                                        lng: 105.81603412628169
                                    }}
                                    zoom={15}
                                    radius={-1}
                                    onChange={this.changeLocation}
                                />
                                <h5>{this.state.address}</h5>
                                <Button
                                    onClick={this.hintShowtime}
                                    disabled={this.state.hinting}
                                    color="primary" >Gợi ý suất chiếu</Button>
                                {this.renderHint()}
                            </CardBody>
                        </Card>

                        <Card className="movie-card">
                            <CardBody>
                                <CardTitle>Đánh giá phim này</CardTitle>
                                <hr />
                                <Form className="rating-form" onSubmit={this.onSubmitComment}>
                                    {({ formState, formApi }) => (
                                        <div>
                                            <h5>Đánh giá công khai</h5>
                                            <Rating
                                                initialRating={formState.values.point}
                                                onChange={(val) => {
                                                    let vals = Object.assign({}, formState.values);
                                                    vals.point = val;
                                                    formApi.setValues(vals);
                                                }}
                                                className="rating-stars"
                                                emptySymbol="fa fa-star-o fa-2x"
                                                fullSymbol="fa fa-star fa-2x"
                                            />
                                            <Text type="text" field="name"
                                                placeholder="Tên bạn..."
                                                className={"rate-form-input" + (formState.errors.name ? " erorr" : "")}
                                                validate={this.validateRequired} />

                                            <Text type="text" field="email"
                                                placeholder="Email..."
                                                className={"rate-form-input" + (formState.errors.email ? " erorr" : "")}
                                                validate={this.validateRequired} />
                                            <Text field="comment"
                                                placeholder="Nhận xét..."
                                                className={"rate-form-input" + (formState.errors.comment ? " erorr" : "")}
                                                validate={this.validateRequired} />

                                            <Button color="yellow" type="submit">Gửi đánh giá</Button>
                                        </div>
                                    )}
                                </Form>
                                <hr />
                                {this.renderComments()}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}