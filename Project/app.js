const title = document.getElementById('title')
const description = document.getElementById('description')
const button = document.querySelector('.add-btn')
const addBtn = document.getElementById('add-blog-btn')
const blogGrid = document.querySelector('.blog-grid')

function convertTimestampToDate(timestamp) {
    if (!timestamp || typeof timestamp.seconds !== 'number' || typeof timestamp.nanoseconds !== 'number') {
        throw new Error('Invalid timestamp object');
    }

    // Convert Firebase timestamp to JavaScript Date object
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    // Format the date as a readable string
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
}

function getBlogs() {

    const collectionRef = collectionRef(db, "blogs")
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        blogGrid.innerHTML = ""
        querySnapshot.forEach((doc) => {
            const data = doc?.data()
            blogGrid.innerHTML += `
            <div class="blog-card">
            <div class="blog-content">
                <h2 class="blog-title">${data?.title}</h2>
                <p class="blog-description">${data?.description}</p>
                <p class="blog-date">${convertTimestampToDate(data?.createdOn)}</p>
            </div>
        </div>
            `
        });
    });
    return unsubscribe
}
addBtn.addEventListener("click", async (e) => {

    e?.preventDefault()
    button.setAttribute("disabled", true)
    button.innerHTML = "Loading..."

    try {

        const collectionRef = collectionRef(db, "blogs")
        const data = { title: title?.value, description: description?.value, createdOn: Timestamp.fromDate(new Date()), }
        await addDoc(collectionRef, data);
        title.value = ""
        description.value = ""

    } catch (e) {

        console.error("Error adding document: ", e);

    } finally {

        button.setAttribute("disabled", false)
        button.innerHTML = "Add Blog"
    }
})
getBlogs()