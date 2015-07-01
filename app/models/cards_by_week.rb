class CardsByWeek
  def initialize(c)
    @cards = c
  end

  def process
    create_data_structure.to_json
  end

  private

  def cards
    @cards
  end

  def cards_with_due
    cards.select { |card| card[:due] }
  end

  def cards_recently
    cards_with_due.select { |card| ( card[:due].to_date.cweek >= lastweek ) & ( card[:due].to_date.year >= current_year ) }.sort_by { |card| card[:due] }
  end

  def lastweek
    Date.today.cweek - 1
  end

  def group_by_week
    cards_recently.group_by do |card|
      week = card[:due].to_date.cweek
      Date.commercial(current_year, week)
    end
  end

  def current_year
    Date.today.year
  end

  def firstmonth
    cards_recently.first[:due].to_date.strftime('%B')[0..2]
  end

  def lastmonth
    cards_recently.last[:due].to_date.strftime('%B')[0..2] 
  end

  def create_data_structure
    structure= {}
    unless group_by_week.to_a.empty?
      structure["first_month"] = firstmonth
      structure["last_month"] = lastmonth
      structure["iterations"] = group_by_week
    end
    structure
  end

end