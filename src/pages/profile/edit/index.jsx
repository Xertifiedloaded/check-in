import DeleteAccount from "./DeleteAccount"
import ProfileInfo from "./ProfileInfo"
import UpdatePassword from "./UpdatePassword"


export default function UpdateProfile() {
  return (
    <section className=" ">
      <div className="border-b">
        <div className="nav-wrapper py-6">
          <h1>Profile</h1>
        </div>
      </div>

      <div className="nav-wrapper my-6 ">
        <ProfileInfo />
      </div>

      <div className="nav-wrapper my-6 ">
        <UpdatePassword />
      </div>
      <div className="nav-wrapper my-6 ">
        <DeleteAccount />
      </div>
    </section>
  )
}
