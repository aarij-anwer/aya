import {
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';

export default function ContentSection() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-4 pt-10 pb-20 text-base/7 text-gray-700 lg:px-8 dark:bg-gray-900 dark:text-gray-300">
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
        Policies
      </h1>
      <section>
        <h2 className="my-4 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl dark:text-white">
          Qutoof Courses
        </h2>
        <p className="mt-4 text-base">
          These are all the courses taught by Sh Muhammad Helmi, including
          Foundations, Mulha, QUR&apos;AN STUDY, Sarf, Balagha and Advanced
          Islamic Studies.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6">
          <li>No classes taught during Ramadan or on Eidul Fitr.</li>
          <li>Class schedules are posted prior to registration.</li>
          <li>
            Classes will be off for one week of Eidul Adha starting from the day
            of Arafah.
          </li>
          <li>
            All other vacations (New Year’s, long weekends) are subject to
            scheduling.
          </li>
          <li>
            All vacations (Eid or otherwise) are listed in the course syllabus
            given to students upon registration.
          </li>
          <li>
            Classes are offered according to the Eastern Time zone, even after
            Daylight Savings Time. Please check your local class timings (link
            is usually emailed).
          </li>
        </ol>
      </section>
      <section>
        <h2 className="my-4 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl dark:text-white">
          Qur&apos;an Classes
        </h2>
        <section>
          <div className="mt-4 text-xl">Billing and refunds</div>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              Billing for the Qur&apos;an classes is year-round and continues
              during scheduled breaks like Ramadan/Eid vacations.
            </li>
            <li>
              No refunds will be applicable where a student does not attend a
              class/es and the reason for the non-attendance is not caused by
              the teacher/academy.
            </li>
            <li>
              Class credits are applicable if the teacher misses a scheduled
              class without providing a reason. They can be obtained by emailing
              admin@qutoofacademy.com.
            </li>
          </ol>
        </section>
        <section>
          <div className="mt-4 text-xl">
            Withdrawals/Cancellation of classes
          </div>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              Withdrawals must be done by emailing admin@qutoofacademy.com.
            </li>
            <li>
              In the case of a withdrawal, the final bill will be the end of the
              current billing cycle.
              <p className="italic">
                For example, if you are billed on the 15th of the month and you
                withdrew on the 1st of the month, your final bill will be
                charged on the 15th.
              </p>
            </li>
          </ol>
        </section>
        <section>
          <div className="mt-4 text-xl">Scheduled breaks</div>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              Classes will be off for two weeks in Ramadan: from the 20th of
              Ramadan to the 4th of Shawwal (according to Egypt).
            </li>
            <li>
              Classes will resume from the 5th of Shawwal or later as per the
              schedule of the students.
            </li>
            <li>
              Classes will be off for one week in Dhul Hijjah: from the day of
              Arafah to 15th of Dhul Hijjah (according to Egypt).
            </li>
            <li>
              All other vacations are to be decided and agreed upon between the
              student and teacher.
            </li>
          </ol>
        </section>
        <section>
          <div className="mt-4 text-xl">Class schedule</div>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              Students are required to adjust their class times to accommodate
              changes resulting from the implementation of Daylight Saving Time
              in their locality.
            </li>
            <li>
              Changes in class schedule are to be discussed and agreed upon
              between the teacher and student.
            </li>
          </ol>
        </section>
        <section>
          <div className="mt-4 text-xl">Absence of teacher or student</div>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              If a student misses a class (for reasons other than an emergency),
              there is no obligation on the instructor to offer a make up class.
            </li>
            <li>
              If an instructor misses a class for any reason, the instructor is
              obligated to offer a make up class at a mutually agreeable time.
              If the make up class cannot be scheduled, the student can apply
              for a class credit by emailing admin@qutoofacademy.com.
            </li>
          </ol>
        </section>
      </section>
      <section>
        <h2 className="my-4 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl dark:text-white">
          3rd Party Classes
        </h2>
        <p className="mt-4 text-base">
          All policies for the Qur’an Classes also apply to the 3rd Party
          Classes. In addition, the following policies uniquely apply to 3rd
          Party Classes.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6">
          <li>
            Class schedule and curriculum for 3rd party classes is agreed upon
            between the students and instructor.
          </li>
          <li>
            Billing for 3rd party classes is agreed upon between the students
            and instructor. Payments are made through the Qutoof website.
          </li>
          <li>
            If the student and instructor decide to cancel classes for Ramadan,
            then it is the responsibility of the student to email the
            administration to stop automatic payments OR to stop the payments
            themselves on PayPal.
          </li>
          <li>
            If the student and instructor decide to continue classes for a part
            of Ramadan, then the payment cycle should continue according to
            schedule.
          </li>
          <li>
            It is the responsibility of the student to coordinate with the
            instructor when to restart classes after Ramadan.
          </li>
          <li>
            It is the responsibility of the student to restart payments as soon
            as classes are resumed.
          </li>
        </ol>
      </section>
      <div className="mt-6">Updated on September 2, 2025.</div>
    </div>
  );
}
