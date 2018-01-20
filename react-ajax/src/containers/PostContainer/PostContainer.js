import React, {Component} from 'react';
import { PostWrapper, Navigate, Post, Warning } from '../../components';
import * as service from '../../services/post';

class PostContainer extends Component {
    
    constructor(props){
        super();
        
        this.state = {
            postId: 1,
            fetching: false, // tells whether the request is waiting for response or not
            post: {
                title: null,
                body: null,
            },
            comments: [],
            warningVisibility: false
        };
    }
    
    componentDidMount(){
        this.fetchPostInfo(1);
    }
    
    showWarning = () => {
        this.setState({
            warningVisibility: true
        });
        
        // after 1.5 sec
        
        setTimeout(
            () => {
                this.setState({
                    warningVisibility: false
                });
            }, 1500
        );
    }
    
    // 원래는 컴포넌트의 메소드가 만들어질 때 메소드를 만든뒤 thif를 바인드 했어야했다.
    // this.myMethod = this.myMethod.bind(this) 이러첨
    // 하지만 화살표 함수로 메소드를 선언해주면 binding이 따로 필요없다.
    // 이는 babel플러그인 transform-class-porperties가 적용되어있기 때문
    fetchPostInfo = async (postId) => {
        
        this.setState({
            fetching: true // requesting..
        })
        
        // 두번의 비동기 요청을 하는데 순서를 기다려야 한다.
        /*
        const post = await service.getPost(postId);
        console.log(post);
        const comments = await service.getComments(postId);
        console.log(comments);
        */
        
        try{
            const info = await Promise.all([
                    service.getPost(postId),
                    service.getComments(postId)
                ]);
            
            /*
            const { a, b } = c 의 형식의 코드는 ES6 의 Object Destructuring
            (객체 비구조화 할당)문법입니다. 
            필요한 값을 객체에서 꺼내서, 그 값을 가지고 레퍼런스를 만들어주죠.
            */
            const { title, body } = info[0].data;
            
            const comments = info[1].data;
            
            this.setState({
                postId,
                post: {
                    title,
                    body
                },
                comments,
                fetching: false // done! 
            });
        }catch(e){
            // if err, stop at this point
            this.setState({
                fetching: false
            });
            this.showWarning();
        }
    }
    
    handleNavigateClick = (type) => {
        const postId = this.state.postId;
        
        if(type === 'NEXT'){
            this.fetchPostInfo(postId+1);
        }else{
            this.fetchPostInfo(postId-1);
        }
    }
    
    render() {
        // 비 구조화 할당문
        const {postId, fetching, post, comments, warningVisibility } = this.state;
        
        return (
            <PostWrapper>
                <Navigate
                    postId={postId}
                    disabled={fetching}
                    onClick={this.handleNavigateClick}
                />
                <Post
                    postId={postId}
                    title={post.title}
                    body={post.body}
                    comments={comments}
                />
                <Warning visible={warningVisibility} message="That post does not exist"/>
            </PostWrapper>
        );
    }
}

export default PostContainer;