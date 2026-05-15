With the application deployed, I have noticed two things:
1. The resolution on my iPad 2 is much lower, which causes the digital display part to be overly large vs. the overal dial. 
2. The iPad 2 is rather slow, so the second hand animation is not entirely smooth.

To address 1, I was thinking of finding a way to have the digital text block dependent on the overall size of the dial. I just want a relative rectangle in the dial and the text should fill that up. So the proportions remains stable, on whichever screen we are displaying.

To address 2, I was wondering if we can do something to reduce the amount of computations or make more effective use of optimised animations. I really don't know what the biggest hurdle is at the moment.

In order to address further evaluation I was also thinking it would be nice if I would have a test page, where I can play with the clock. Walk through specific times, check various sizes of the dial. Such a test page should not be in the same folder as the actual source, but should obviously use as much of the real code for the actual clock as possible. I want my main code, which I need to deploy to S3, to be kept separate from any testing code.

Can we make a plan for these 3 concerns and start handling them one by one (not necesarily in this order)
