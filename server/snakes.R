library(bareSnakes)

snakes <- NULL
prevkey <- NULL
capturedFood <- NULL


playSnake <- function(id,arenaSize = 45L) {
  
  ARENA_SIZE <- arenaSize
  
  
  .GlobalEnv$snakes <- new.env()
  .GlobalEnv$prevkey <- new.env()
  .GlobalEnv$capturedFood <- new.env()
  playerIds <- c(id)

  #The third attribute represents the direction of the next move of
  #that point
  #1 - L, 2 - R, 3 - U, 4 - D
  .GlobalEnv$snakes[[id]] <- lapply(6L:3L,function(x,y) c(x,y,2L),sample(1L:40L,1))
  .GlobalEnv$capturedFood[[id]] <- NULL
  .GlobalEnv$prevkey[[id]] <- 2L
  crossed = list(FALSE)
  names(crossed) <- id
  
  food <- sample(ARENA_SIZE,2L)
  
  moveSnake <- function(id){
      moveSnakeC(ARENA_SIZE)
      
      if(gameOver(.GlobalEnv$snakes[[id]]))
      {
        #IMPORTANT
        cat(paste0(id,",Your score: ",length(.GlobalEnv$snakes[[id]]),"\n"))
        rm(list = id,envir = .GlobalEnv$snakes)
        rm(list = id,envir = .GlobalEnv$capturedFood)
        rm(list = id,envir = .GlobalEnv$prevkey)
        playerIds <<- setdiff(playerIds,id)
        if(length(ls(.GlobalEnv$snakes)) == 0)
          return(1)
        return(2)
      }
      
      crossee <- names(which(crossed == TRUE))
      if(length(crossee) > 0 ) {
        lapply(crossee,function(id)
        {
          .GlobalEnv$snakes[[id]][[length(.GlobalEnv$snakes[[id]])+1]] <-
            c(.GlobalEnv$capturedFood[[id]][[1]],0)
          .GlobalEnv$capturedFood[[id]] <- .GlobalEnv$capturedFood[[id]][-1]
          crossed[[id]] <<- FALSE
          # cat("grown")
        })
      }
      
      if(captor(food)){
        # cat("newFood")
        food <<- sample(ARENA_SIZE,2)

        o = "["
        sapply(sort(playerIds),function(m){
            o <<- paste0(o,length(.GlobalEnv$snakes[[m]])+length(.GlobalEnv$capturedFood[[m]]),",")
          })
        o = paste0(o,"0]")
        #IMPORTANT
        cat(o)
        # while(any(sapply(.GlobalEnv$snakes[[win]],"%in%",food))){
        #   food <- sample(ARENA_SIZE,2)
        # }
       
      } 
      # cat("checkinCross")
      # cat(paste(crossed))
      crossed <<- setCrossee(crossed)
      # cat(paste(crossed))
     
    # }
    write.socket(serverSocket,paste0("{\"s\":",snakeData(FALSE),",",
                                     paste0("\"f\":[",food[1], ",",food[2],"]}")))
    return(2)
  }
  
  keydown <- function(id,key) {
    if (key == '40') {
      if(.GlobalEnv$prevkey[[id]] != 4){
        .GlobalEnv$prevkey[[id]] <- 3L
      }
    }
    else if(key == '38'){
      if(.GlobalEnv$prevkey[[id]] != 3){
        .GlobalEnv$prevkey[[id]] <- 4L
      }
    }
    else if(key == '37'){
      if(.GlobalEnv$prevkey[[id]]!=2){
        .GlobalEnv$prevkey[[id]] <- 1L
      }
    }
    else if(key == '39'){
      if(.GlobalEnv$prevkey[[id]] != 1){
        .GlobalEnv$prevkey[[id]] <- 2L
      }
    }
    else if(key == 'new'){
      .GlobalEnv$snakes[[id]] <- lapply(6L:3L,function(x,y) c(x,y,2L),sample(1L:40L,1))
      .GlobalEnv$prevkey[[id]] <- 2L;
      .GlobalEnv$capturedFood[[id]] <- NULL
      crossed[id] <<- FALSE
      playerIds <<- c(playerIds,id)

    }
    else if(key == '27'){
      #IMPORTANT
      cat(paste0(id,",Your score: ",length(.GlobalEnv$snakes[[id]]),"\n"))
      rm(list = id,envir = .GlobalEnv$snakes)
      rm(list = id,envir = .GlobalEnv$capturedFood)
      rm(list = id,envir = .GlobalEnv$prevkey)
      playerIds <<- setdiff(playerIds,id)
      if(length(ls(.GlobalEnv$snakes)) == 0)
        return(1)
    }
    return(moveSnake(id))
  }
  
  moveSnake(id)
  data <- unlist(strsplit(read.socket(serverSocket),","))
  x <- 0
  while(x != 1)
  {
    x <- keydown(data[1],data[2])
    data <- unlist(strsplit(read.socket(serverSocket),","))
  }
  
}
