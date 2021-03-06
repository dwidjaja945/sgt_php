/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

var studentArray = [];
class Student {
    constructor(name, course, grade) {
        this.student_name = name;
        this.class_name = course;
        this.grade_value = grade;
    }
}

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/

function initializeApp() {
    addClickHandlersToElements();
    updateStudentList(studentArray);
    getDataFromServer();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements() {
    $(".addButton").click(handleAddClicked);
    $(".cancelButton").click(handleCancelClicked);
    $("#student_name").click(() => {sortBy("student_name")});
    $("#class_name").click( () => { sortBy("class_name") } );
    $("#grade_value").click( () => { sortBy("grade_value")});
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event) {
    // $(".noData").css("display", "none");
    addStudent();
}

/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClicked() {
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
    var studentName = $("#studentName").val();
    var studentCourse = $("#course").val();
    var studentGrade = $("#studentGrade").val();
    var newStudent = new Student(studentName, studentCourse, studentGrade);
    // studentArray.push(newStudent);
    // updateStudentList(studentArray);
    sendDataToServer(newStudent, studentName, studentCourse, studentGrade);
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
    $("#studentName").val("");
    $("#course").val("");
    $("#studentGrade").val("");
}

/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj, index) {
    var studentName = studentObj.student_name;
    var studentCourse = studentObj.class_name;
    var studentGrade = studentObj.grade_value;
    var studentNameData = $("<td>").text(studentName);
    var studentCourseData = $("<td>").text(studentCourse);
    var studentGradeData = $("<td>").text(studentGrade);
    var deleteButton = $("<div>")
        .text("Delete")
        .addClass("btn btn-danger");
    var tableRow = $("<tr>");

    function deleteHandler() {
        deleteButton.click(function () {
            debugger;
            $(tableRow).remove();
            studentArray.splice(index, 1);
            deleteDataFromServer(studentObj, studentArray);
        })
    }
    deleteHandler();
    $(tableRow).append(studentNameData, studentCourseData, studentGradeData, deleteButton);
    $("tbody").append(tableRow);
    if (studentArray.length === 0) {
        $(".noData").css("display", "block");
    }
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(arrayOfStudents) {
    $("td").remove();
    $("tr > div").remove();
    for (var i = 0; i < arrayOfStudents.length; i++) {
        renderStudentOnDom(arrayOfStudents[i], i);
    }

    renderGradeAverage(calculateGradeAverage(arrayOfStudents));
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(arrayofStudents) {
    var gradeArray = [];
    var average = null;
    var totalGradePoints = 0;
    // Push into student array;
    for (var i = 0; i < arrayofStudents.length; i++) {
        let studentGrade = parseFloat(arrayofStudents[i].grade_value);
        gradeArray.push(studentGrade);
        totalGradePoints += studentGrade;
    };

    function calculateAverage(totalGradePoints) {
        debugger;
        totalGradePoints = parseFloat(totalGradePoints);
      if (gradeArray.length === 0) {
        return 0;
      }
      average = totalGradePoints / gradeArray.length;
      if (average === 100) {
        return average;
      } else {
        return average.toPrecision(4);
      }
    }
    return calculateAverage(totalGradePoints);

}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average) {
    $(".avgGrade").text(average + "%")
}

/***************************************************************************************************
 * getDataFromServer - retrieves data from the learningFuze server
 * @param: {undefined} none
 * @returns {undefined} none
 */
var data = null;
function getDataFromServer() {
    var ajaxCall = {
        dataType: 'json',
        // url: 'https://s-apis.learningfuze.com/sgt/get',
        url: '../server/get_student_data.php',
        // method: 'POST',
        method: 'GET',
        // data: {
        //     api_key : 'tD3GKQ3kHH'
        // },
        success: function (results) {
            console.log("server results: ", results);
            studentArray.length = 0;
            for (var ajaxIndex = 0; ajaxIndex < results.data.length; ajaxIndex++) {
                studentArray.push(results.data[ajaxIndex]);
            }
            updateStudentList(studentArray);
            if(results.data.length === 0) {
                $(".noData").css("display", "block");
            } else {
                $(".noData").css("display", "none");
            }
        },
        error: function () {
            $(".modal").css("display", "block");
            $(".modalMessage").text("Could not pull data from server.");
            $("*").click(function () {
                $(".modal").css("display", "none");
            })
        }
    };
    $.ajax(ajaxCall)
}

/***************************************************************************************************
 * sendDataToServer - sends data entered by user to the LFZ server
 * @param: {studentObj} new student object created
 * @returns {undefined} none
 */
function sendDataToServer(studentObj, name, course, grade) {
    var outData = {
        student_name: studentObj.student_name,
        class_name: studentObj.class_name,
        grade_value: studentObj.grade_value
    };

    // make sure inputs are not empty
    if( name === "" || course === "" || grade === "") {
        if ($(".inputMessage").text() !== "") {
            return;
        }
        let emptyInputMessage = $("<h3>").text("Fields cannot be left blank").addClass("pull-left");
        $(".inputMessage").append(emptyInputMessage);
        return;
    } else {
        $(".inputMessage").text("");
    }

    // make sure that grade is not over 100
    if (parseFloat(grade) > 100) {
        if ($(".inputMessage").text() !== "" ) {
            return;
        };
        let gradeTooHighMessage = $("<h3>").text("Grade too high").addClass("pull-left");
        $(".inputMessage").append(gradeTooHighMessage);
        return;
    } else {
        $(".inputMessage").text("");
    };

    var ajaxSend = {
        url: "../server/add_students.php",
        method: 'POST',
        dataType: "JSON",
        data: outData,
        success: function (results) {
            if (results.success) {
                var newStudent = new Student(name, course, grade);
                newStudent.id = results.new_id;
                studentArray.push(newStudent);
                updateStudentList(studentArray);
                if(studentArray.length > 0) {
                    $(".noData").css("display", "none");
                };
                console.log(results);
                console.log("sendDataToServer: success");
            } else {
                $(".modal").css("display", "block");
                $(".modalMessage").text(`Error : ${results.errors}`);
                $("*").click(function () {
                    $(".modal").css("display", "none");
                });
                if (studentArray.length === 0) {
                    $(".noData").css("display", "block");
                } else {
                    $(".noData").css("display", "none");
                }
            }
        },
        error: function (errors) {
            $(".modal").css("display", "block");
            $(".modalMessage").text(`Error ${errors.status} :  ${errors.statusText}`);
            $("*").click(function () {
                $(".modal").css("display", "none");
                // document.getElementById("point").style.cursor = "loader";
            });
            console.log(errors.status, errors.statusText);
        }
    };
    $.ajax(ajaxSend);

}

/***************************************************************************************************
 * deleteDataFromServer - deletes data from the server
 * @param: {studentObj} new student object created
 * @returns {undefined} none
 */

function deleteDataFromServer(studentObj, arrayOfStudents) {
    var ajaxDelete = {
        url: "../server/delete_student.php",
        method: "POST",
        data: {
            student_id: studentObj.id
        },
        success: function (results) {
            debugger;
            console.log("deleteDataFromServer success");
            console.log(results);
            if (studentArray.length === 0) {
                $(".noData").css("display", "block");
            } else {
                $(".noData").css("display", "none");
            };
            getDataFromServer();
        },
        error: function (errors) {
            $(".modal").css("display", "block");
            $(".modalMessage").text(`Error ${errors.status} :  ${errors.statusText}`);
            $("*").click(function () {
                $(".modal").css("display", "none");
            })
        }
    };
    $.ajax(ajaxDelete);
}


/***************************************************************************************************
 * onGradeKeyPress - Makes sure that whatever the user types in the grade section will be a number
 */

 function onGradeKeyPress() {
     if (isNaN($("#studentGrade").val())) {
         $("#studentGrade").val("");
     };

     const currentValue = $("#studentGrade").val();

     if (currentValue.length > 3) {
         $("#studentGrade").val(currentValue.slice(0, 3));
     }
 };



/***************************************************************************************************
 * sortBy - Sorts the data based off the column user clicks on
 */

function sortBy(column) {
    var ajaxCall = {
        dataType: 'JSON',
        url: '../server/get_student_data.php',
        method: 'POST',
        data: {
            order_by: column
        },
        success: function (results) {
            console.log("server results: ", results);
            studentArray.length = 0;
            for (var ajaxIndex = 0; ajaxIndex < results.data.length; ajaxIndex++) {
                studentArray.push(results.data[ajaxIndex]);
            }
            updateStudentList(studentArray);
            // $(".noData").css("display", "none");
        },
        error: function () {
            $(".modal").css("display", "block");
            $(".modalMessage").text("Could not pull data from server.");
            $("*").click(function () {
                $(".modal").css("display", "none");
            })
        }
    };
    $.ajax(ajaxCall)
};