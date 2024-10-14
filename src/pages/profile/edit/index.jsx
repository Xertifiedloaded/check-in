
import DeleteAccount from "./DeleteAccount"
import ProfileHeader from "./ProfileHeader"
import ProfileInfo from "./ProfileInfo"
import UpdatePassword from "./UpdatePassword"
import PageHead from "@/components/PageHead"
import StreakPage from "@/components/Streak"

export default function UpdateProfile() {
  return (
    <>
      <PageHead title="Profile" description="description" content="" />
      <ProfileHeader />
      <div className="nav-wrapper mt-28 my-6 ">
        <StreakPage />
      </div>
      <section className=" ">
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
