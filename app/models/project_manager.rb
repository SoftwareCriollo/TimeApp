require 'json'
require 'yaml'

class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:url]

  CARDS_ATTRIBUTES= [:id, :name, :url, :list_id, :due]

  ALLOWED_LIST_NAMES= [/doing/i, /to define/i, /done/i, /to do/i ]

  def initialize
    @organization = find_organization
    #@espcial_board_ids = ["5427061ed62e617fa949b9fb"] #[Opensublet]
    @espcial_board_ids = [] #[Opensublet]
  end

  def especial_boards
   @espcial_board_ids.map{|bid| Trello::Board.find(bid)}
  end

  def boards
    @organization.boards.select{|board| !board.closed?}.concat(especial_boards)
  end

  def cards_by_board(board_id)
    @board = find_board(board_id)
    lists = allowed_lists(@board.lists)
    @lists_hash = lists.inject({}) do |hash,list|
      hash[list.id]= list.name
      hash
    end
    @id_lists = @lists_hash.keys
    add_name_list_to_cards
  end

  def cards_by_board_due(board_id)
    CardsByWeek.new(cards_by_board(board_id)).process
    cards = cards_by_board(board_id).select{|card| card[:due] }
    cardssorted = cards.sort_by {|card| card[:due]}
  end

  def cards_by_week(board_id)
    thisweek = Date.today.cweek
    lastweek = thisweek - 1
    cards = cards_by_board_due(board_id)
    cards.select do |card|
      date = card[:due].to_date
      date.cweek
      card unless (date.cweek < lastweek)
    end
  end

  def cards_to_json(board_id)
    the_cards = []
    #iteration = {}
    iteration = []

    cards_by_week(board_id).each { |card|
      #iteration["date"] = card[:due].strftime("%m/%d/%Y")
      #iteration["url"] = card[:url]
      #iteration["name"] = card[:name]

      
      iteration.push("date", card[:due].strftime("%m/%d/%Y"))
      iteration.push("url", card[:url])
      iteration.push("name", card[:name])


      #the_cards["month"] = card[:due].strftime("%B")
      the_cards.push("month", card[:due].strftime("%B"))
      the_cards.push("iteration", iteration)
      #the_cards["iteration"] = iterations
    }
    puts the_cards
  end

  def boards_serialized
    arrays_object(boards,BOARD_ATTRIBUTES)
  end

  def add_name_list_to_cards
    selected_cards = arrays_object(filter_cards_by_list, CARDS_ATTRIBUTES)
    selected_cards.map do |card|
      card[:list_name] = @lists_hash[card[:list_id]]
    end
    selected_cards
  end

  def filter_cards_by_list
    @board.cards.inject([]) do |result_cards, card|
      if @id_lists.include?(card.list_id)
        result_cards << card
      else
        result_cards
      end
    end
  end

  def project_name(project_id)
    find_board(project_id).name
  end

  def task_name(task_id)
    find_card(task_id).name
  end

  def organization_name
    'softwarecriollo2'
  end

  def allowed_lists(lists)
    lists.select{|list| allowed_list?(list) }
  end

  def allowed_list?(list)
    #ALLOWED_LIST_NAMES.any?{|name| name.match(list.name) }
    true
  end

  def get_cards(lists)
    lists.inject({}) do |value, list|
      value[list.name] = list.cards
      value
    end
  end

  def find_board(board_id)
    Trello::Board.find(board_id)
  end

  def find_card(card_id)
    Trello::Card.find(card_id)
  end

  def find_organization
    Trello::Organization.find(organization_name)
  end


end
