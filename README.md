# cl-interflow

Define A Simple Protocol For Interflow Based On Function.


## protocol

 ```
 caller                                       dealer
 | in                                              |
 | in -> rawIn                                     |
 | rawIn        ------------------->         rawIn |
 |                                     rawIn -> in |
 |                                       in -> out |
 |                                   out -> rawOut |
 | rawOut       <-------------------        rawOut |
 | rawOut -> out                                   |
 | out                                             |
 ```
