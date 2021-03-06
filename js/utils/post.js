import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {setTextContent, truncateText} from "./common"
// to use fromNow function for timespan
dayjs.extend(relativeTime)

export function createElement(post){    
    if(!post) return;
    // clone template
    const postTemplate = document.getElementById('postItemTemplate')
    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if(!liElement) return;

    // update title, description, author
    setTextContent(liElement, '[data-id="title"]', post.title)
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
    setTextContent(liElement, '[data-id="author"]', post.author)

    // update thumbnail
    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if(thumbnailElement) {
        thumbnailElement.src = post.imageUrl
        // if thumbnail not found
        thumbnailElement.addEventListener('error',() => {
            thumbnailElement.src = 'http://via.placeholder.com/1368x400?text=Thumbnail+Not+Found';
        })
    }
    
    //update timespan
    const timeSpan = liElement.querySelector('[data-id="timeSpan"]')
    const dataTime = post.updatedAt
    if(timeSpan){
        timeSpan.textContent = dayjs(dataTime).fromNow()
    }
    // attach events
    // click item and redirect to post-item detail
    const postItem = liElement.querySelector('.post-item')
    if(postItem){
        postItem.addEventListener('click', () => {
            window.location.assign(`/post-detail.html?id=${post.id}`)
        })
    }

    const menu = liElement.querySelector('.post-item-menu')
    menu.addEventListener('click',(e) => { e.stopPropagation() })

    const editBtn = liElement.querySelector('[data-id="edit"]')
    if(editBtn){
        editBtn.addEventListener('click',(e) => {
            e.stopPropagation();
            window.location.assign(`/add-edit-post.html?id=${post.id}`)
        })
    }

    const removeBtn = liElement.querySelector('[data-id="remove"]')
    if(removeBtn){
        removeBtn.addEventListener('click',(e) => {
            const customEvent = new CustomEvent('post-delete',{
                bubbles: true,
                detail: post,
            })

            removeBtn.dispatchEvent(customEvent)
        })
    }

    return liElement
}

export function renderPostList(elementId, postList){
    const ulElement = document.getElementById(elementId)
    if(!Array.isArray(postList) || postList.length === 0) {
        ulElement.innerText = 'Search results are not available';
        return;
    };
    if(!ulElement) return;
    //clear the before content
    ulElement.textContent = '';

    // loop and render
    postList.forEach((post,idx) => {
        const liElement = createElement(post);
        ulElement.appendChild(liElement)
    })
}