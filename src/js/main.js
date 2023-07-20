  let projects = [];
  let projectStatus = 1;
  //Get the button
  let mybutton = document.getElementById("btn-back-to-top");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  mybutton.addEventListener("click", backToTop);
  
  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
  $(".menu-title").on('click', function(el) {
    el.preventDefault();
    let url = $(this).children().attr("href");
    window.location.replace(url);
  });

  /**
   * @description Loads correct page into link tabs container
   */
  $(".links-tab").on('click', function(el) {
    el.preventDefault();
    if($(this).hasClass("link-page-3dprintting")) {
      $(".tabs-content").load("./src/views/3dprintting.html");
    } else {
      $(".tabs-content").html("");
    }
  });

  /**
   * @description Handling with projects table, order by Status
   */
  $(".project-status").on('click', function(el) {
    el.preventDefault();
    projectStatus == 2
    ? projectStatus = 0 
    : projectStatus++;
    orderProjectsByStatus();
  });

  function setProjects() {
    $.ajax({
      type: "POST",
      url: "src/data/projects.json",
      success: function(data) {
        projects = data.projects;
        buildProjectsTable();
      }
    });
  }

  /**
   * @description Each time clicked on field status at table header, it will change it status order
   * @param String status  2 finished,  1 ongoing, 0 abandoned
   */
  function orderProjectsByStatus() {
    let auxProjectsFinished = [];
    let auxProjectsOnGoing = [];
    let auxProjectsAbandoned = [];
    let result = [];
    let data = {};
    $.each(projects, function(index, el) {
      data.project = el.project;
      data.description = el.description;
      data.technology = el.technology;
      data.status = el.status;
      data.repository = el.repository;
      data.website = el.website;
      switch(el.status) {
        case "0":
          auxProjectsAbandoned.push(data);
          break;
        case "1":
          auxProjectsOnGoing.push(data);
          break;
        case "2":
          auxProjectsFinished.push(data);
          break;
        default:
          break;
      }
    });
    data = {};
    
    switch(projectStatus) {
      case 1:

        auxProjectsAbandoned.length == "0" ? '' : result.push(auxProjectsAbandoned);
        auxProjectsOnGoing.length == "0" ? '' : result.push(auxProjectsOnGoing);
        auxProjectsFinished.length == "0" ? '' : result.push(auxProjectsFinished);
        break;
        case 2:
          auxProjectsAbandoned.length == "0" ? '' : result.push(auxProjectsAbandoned);
          auxProjectsOnGoing.length == "0" ? '' : result.push(auxProjectsOnGoing);
          auxProjectsFinished.length == "0" ? '' : result.push(auxProjectsFinished);
          break;
        case 0:
          auxProjectsAbandoned.length == "0" ? '' : result.push(auxProjectsAbandoned);
          auxProjectsOnGoing.length == "0" ? '' : result.push(auxProjectsOnGoing);
          auxProjectsFinished.length == "0" ? '' : result.push(auxProjectsFinished);
          break;
      default:
          break;
    }

    $.each(result, function(index, el) {
      projects[index] = el[index];
    });
    buildProjectsTable();
  }

  function setProjectStatus(status) {
    switch (status) {
      case 0:
        return "Abandoned";
      case 1:
        return "OnGoing";
      case 2:
        return "Finished";
      default:
        return "Finished";
    }
  }

  function buildProjectsTable() {
    let html = "";
    $.each(projects, function(index, el) {
      html += "<tr>";
      html += "<td>" + el.project + "</td>";
      html += "<td>" + el.description + "</td>";
      //html += "<td>" + el.technology + "</td>";
      html += "<td>" + setProjectStatus(el.status) + "</td>";
      html += "<td>" + '<a href="' + el.repository +'" target="_blank">Visit</a>' + "</td>";
      html += "<td>" + '<a href="' + el.website +'" target="_blank">Visit</a>' + "</td>";
      html += "</tr>";
    });
    $($("#tableProjects").find("tbody")).html(html);
  }

  $(document).ready(
    function() {
      setProjects();
    }
  );

  