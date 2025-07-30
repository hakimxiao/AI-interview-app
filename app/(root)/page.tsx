import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Ayo Mulai Interview Mu Dengan Mudah Bersama AI</h2>
          <p className="text-lg">
            Praktek dengan pertanyaan asli interview & dapatkan feedback
            langsung
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Ayo Mulai Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-5 mt-8">
        <h2>Interview Kamu</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Mulai sebuah interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}

          {/* <p>Kamu belum mengambil interview tersedia</p> */}
        </div>
      </section>
    </>
  );
};

export default Page;
