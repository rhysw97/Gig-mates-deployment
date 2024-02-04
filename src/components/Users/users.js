import { useEffect, useState } from "react"
import { getRequest } from "../../utils/server-queries";

export default function Users() {
    const [users, setUsers] = useState();
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                console.response = await getRequest('')
            } catch (err) {
                console.error(err)
            }
        }
    }, [])

    return (
        <article>
            <h2>Users List</h2>
            {
                users?. length
                ?(
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
    )
}