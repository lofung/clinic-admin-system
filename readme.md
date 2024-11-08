The system is available to be viewed at production in<br/>
https://time-table-scorer1.herokuapp.com/
<br/>
## Business Requirements<br/>

roughtly<br/>
(1) Able to change clinical entries quickly, as doctors also take last-minute annual leaves or have family issues to deal with<br/>
(2) Count very accurately on workload<br/>
(3) Possible different weights in different clinical records<br/>
(4) Able to "swap" duties<br/>
(5) Employees who have left must have their name removed, however those names cannot be removed from records.<br/>
(6) Must be easy to use. Some doctors are old. And no need of fancy eye-catching modern features.<br/>
(7) The clinical counts and roster displays are used internally, no external use.<br/>
(8) No need for sophisticated login methods, but a basic auth system.<br/>

(9) Clinics happen on fixed weekdays<br/>
(10) There could be multiple clinics on the same half-day<br/>
(11) There could be multiple doctors with different workloads working in the same clinic<br/>
(12) Must show the overall workload in different length of periods, from season-long to year-long.<br/>
(13) New doctors or new clinics would show up and be removed, must be able to change.

## Potential "fixes" and features that didn't make it (as of January 2021)

(1) Ability to mass input for new seasons using keyboard only (300 lines of clinic inputs for every new season)<br/>
(2) Immediately recognize clinics and doctor matches with word bubbles popups when mass inputing such that there would not be input mistakes.<br/>
(3) Limit choices on dates based on the weekdays selected in the clinic table such that there would not be input mistakes.<br/>
(4) Two doctors completely swapping different times/clinic by dragging entries into each other.<br/>
<br/>
(5) Counting ward duties and other daily duties during weekens and holidays<br/>
(6) Leave counting and data presentation, particularly during seaons like CNY, Christmas, Easter and summer.<br/>
