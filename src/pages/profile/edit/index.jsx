import DeleteAccount from "./DeleteAccount"
import ProfileHeader from "./ProfileHeader"
import ProfileInfo from "./ProfileInfo"
import UpdatePassword from "./UpdatePassword"
import PageHead from "@/components/PageHead"

export default function UpdateProfile() {
  return (
    <>
      <PageHead title="Profile" description="description" content="" />
      <ProfileHeader />
      <section className=" mt-28">
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
    </>
  )
}
