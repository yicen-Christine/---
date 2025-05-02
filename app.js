// 初始化 GUN
const gun = Gun({
    peers: ['http://localhost:8765/gun'] // 您可以添加其他的 peer 節點
});

// 創建一個文章節點
const posts = gun.get('novel-posts');

// 處理表單提交
document.getElementById('newPostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    
    // 創建新文章
    const newPost = {
        title: titleInput.value,
        content: contentInput.value,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(2)
    };
    
    // 儲存文章到 GUN
    posts.get(newPost.id).put(newPost);
    
    // 清空表單
    titleInput.value = '';
    contentInput.value = '';
});

// 顯示文章
function displayPost(post, id) {
    if (!post || !post.title || !post.content) return;
    
    const postsList = document.getElementById('postsList');
    
    // 檢查是否已經存在這篇文章
    if (document.getElementById(`post-${id}`)) return;
    
    const postElement = document.createElement('div');
    postElement.id = `post-${id}`;
    postElement.className = 'post';
    
    const date = new Date(post.timestamp);
    
    postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <div class="post-content">${post.content}</div>
        <div class="post-meta">
            發表於 ${date.toLocaleString('zh-TW')}
        </div>
    `;
    
    // 將新文章插入到列表開頭
    postsList.insertBefore(postElement, postsList.firstChild);
}

// 監聽新文章
posts.map().on(function(post, id) {
    displayPost(post, id);
});