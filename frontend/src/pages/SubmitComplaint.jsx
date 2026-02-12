function SubmitComplaint(){
    return(
        <div>
            <h2>SubmitComplaint</h2>
            <form>
                <input type="text" placeholder="Complaint Title" /><br /><br />
                <textarea placeholder="Describe your issue"></textarea><br /><br />
                <button type="Submit">Submit</button>
            </form>
        </div>
    );
}

export default SubmitComplaint;