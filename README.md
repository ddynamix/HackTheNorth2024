# 🔭 WHAT IS PERCEIV/IO?

PERCEIV/IO is an innovative tool that utilizes the latest AI advancements to assist persons with visual and/or auditory impairments. Approximately [160 million people around the world](https://www.senseinternational.org.uk/our-work/understanding-deafblindness/) have some form of deafblindness that affects their day-to-day lives. PERCEIV/IO was originated from the ground up as both the hardware and software that we are prototyping in this hackathon project.

The main use case of PERCEIV/IO is to use it's camera to take periodic captures of the world in front of the user and use AI image-to-text technologies to translate it into braille, which is then displayed on a tactile hand-held device that we have fabricated. There are other additional features that we have packaged with this product that we feel could be beneficial to this community, listed below.

We hope some of the ideas generated during this hackathon turn are able to be used in organizations such as [CNIB Deafblind Community Services](https://deafblindservices.ca/about-us) in order to help them with their goal of assisting people who need it most.

## 📣 FEATURES
- Get a description of the world in front of you translated into braille directly at your fingertips.
- Store a profile of the user so PERCEIV/IO can recognize common occurrences such as people and places.
- An accompanying app that allows you to view your profile and update it with any necessary info.
- Use Symphonic Labs API to read lips from videos that friends and families send you.

## 🪞 WHAT INSPIRES US?

## 🛠️ HOW WE BUILT IT

Our product is built on multiple different technologies, many of which are thanks to Hack The North 2024's amazing sponsors. Our primary image recognition AI is based on **Groq** using their Llava v1.5 image-to-text endpoint, and that text is then put through **Groq**'s Llama 3.1 70b endpoint to condense it down into just two or three words. All code involved in this process is ran on the integrated Raspberry Pi. The correct sequence of signals is then sent to the stepper motors to display the correct combination of braille characters.

On the backend, our database is based on **Convex** along with our accompanying app. In the

## 🌎 ENVIRONMENTALLY CONSCIOUS

As users of AI during this boom of innovation over the last couple years, we strive to be as environmentally conscious as possible and be aware of the power we are consuming whenever we prompt an LLM. Over the course of a large model's first one million messages, it has an estimated power cost of [55.1Mwh](https://adasci.org/how-much-energy-do-llms-consume-unveiling-the-power-behind-ai/). That's enough power to power roughly 120 American homes for a year! 

Thankfully, with **Groq**, not only do we have access to lightning-fast response speeds, but due to their LPUs, SRAM, and sequential processing we are using less power than if we were to use the traditional NVIDIA counterpart. Conserving energy is very important to us, and we are thankful for Groq to providing a solution for us.

## 🧗‍♀️ CHALLENGES WE'VE OVERCOME

Hackathons are about nothing if not overcoming challenges. Whenever a piece of hardware broke, software wouldn't cooperate, or motors wouldn't connect, we would work as a team to solve the issue and push on through. It ended up being a very rewarding experience for all of us.

One major challenge that's still fresh in my mind is our issues with the Raspberry Pi. We ended up going through _three_ Pi's before we realized that none of their SD cards had any OS on them! Eventually, with the help of the amazing mentors here at Hack The North (thank you again Moody!), we we're able to get the SD card flashed and were able to start uploading our code. Thankfully, due to our adoption of SOLID principles and our policy of encapsulation, we were able to implement the code we has worked on in the meantime with ease.

Another problem was more to do with logic- turning an image into text is easy. Turning that text into braille, and then turning that braille into signals from a Raspberry Pi into 4 proprietary stepper motors that control half of a braille character each is whole other. Luckily with some wisdom from our team members with past experience with these kinds of electronics combined with some logic learned in hardware classes, we as a team were able to come up with the implementation to make it work.

## 🏆 WHAT WE'RE PROUD OF

We are most proud of coming up with a novel idea that uses novel technology to help people in need. I think it is everyone's desire to develop something that is actually useful to other humans, especially while utilizing the latest technologies. We think that technology's greatest advantages are the advantages it is able to give to others in order to promote diversity, equity and inclusion.

We're also proud of the fact that we came up with and created a working prototype for our idea within only 32 hours(!!!). For a lot of us, this was our first time working with hardware within such a short time frame, and so to be able to learn the ins and outs of it enough to make a product is a huge accomplishment.

## 💡 WHAT DID WE LEARN?

Over the course of this hackathon, we learned so much about the Deafblind community by reading online testimonials of those who have been diagnosed. It allowed us insight into a corner of the world that we had otherwise not known much about prior. Through developing our product while keeping these testimonials in mind, we also realized the difference between developing a product in order to beat others in a competition and developing a product because we believe this could actually be useful to real people one day.

The many sponsors here at Hack The North were also very valuable in teaching us about their product and how we can implement them into our product to improve it's functionality and efficiency. For example, Groq were very helpful in describing exactly why utilizing their API was more energy efficient than the big guys. We were super eager to learn about new technologies such as Symphonic labs, as we realized their use-case as an AI that can read lips was very applicable to our device.

## 🔜 THE FUTURE OF PERCEIV/IO

We have thought long and hard about the future of PERCEIV/IO. We've already come up with a laundry list of ideas that we want to implement sometime in the future in order for this product to achieve it's full potential. The number one thing is to shrink the size of the actual hardware. Raspberry Pi's are extremely useful for prototyping- but are a bit too bulky for use in a commercial product. We want to achieve a size similar to a smart watch with similar processing power.

We also want to relocate the camera and have it wirelessly communicate with the computer. One idea was to embed the camera into a pair of sunglasses in a similar style to [Spectacles](https://www.spectacles.com/ca-en/) by Snap Inc.

And finally, we are waiting for the day where AI technology and hardware reaches a point where we can run all models locally, without the need for a massive power bank or network connection. That would truly untether the user from any external requirements for a real feeling of freedom.

Credit to Matthew Montrone for the goose background photo. 


###🪿 Thank you to all who showed interested in PERCEIV/IO, and a huge congratulations to _all_ hackers who submitted in time. **We did it!**
