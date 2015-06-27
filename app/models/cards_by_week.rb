class CardsByWeek
  def initialize(cards)
    @cards = cards
  end

  def proccess
  end
  private

  def cards_with_due
     @cards.select { |card| card[:due] }
  end

  def cards_recently
    cards_with_due.select { |card| card[:due].to_date.cweek >= lastweek }.sort_by { |card| card[:due] }
  end

  def lastweek
    @lastweek ||=  (Date.today.cweek - 1)
  end

  def group_by_week
    @group_by_week ||= cards_recently.group_by do |card|
      week = card[:due].to_date.cweek
      Date.commercial(current_year, week)
    end
  end

  def current_year
    @current_year ||= (Date.today.year)
  end

  def set_interval_month
  end
end
