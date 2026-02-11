
export const UserCard = ({name,email,emailAli,nameD,nameDauud}) => {
    return(
        <div>
            <h1>{name}</h1>
            <p>{email}</p>
            <p>{emailAli}</p>
            <p>{nameD}</p>
            <p>{nameDauud}</p>
        </div>
    )
}

export default UserCard;